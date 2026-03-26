import { query } from "../db";

// ─── Product Types ────────────────────────────────────────────────────────────

export interface ProductFilter {
  ProdType_ID: number;
  TypeName: string;
  SpecCount: number;
  ParamCount: number;
}

export async function getProductFilters(search?: string): Promise<ProductFilter[]> {
  const where = search ? "WHERE TypeName LIKE @search" : "";
  const params = search ? { search: `%${search}%` } : {};
  return query<ProductFilter>(
    `SELECT pt.ProdType_ID, pt.TypeName,
            (SELECT COUNT(*) FROM prodtypespecs  WHERE ProdType_ID = pt.ProdType_ID) AS SpecCount,
            (SELECT COUNT(*) FROM prodtypeparams WHERE ProdType_ID = pt.ProdType_ID) AS ParamCount
     FROM   prodtypes pt
     ${where}
     ORDER  BY pt.TypeName`,
    params
  );
}

export async function getProductFilter(id: number): Promise<ProductFilter | null> {
  const rows = await query<ProductFilter>(
    `SELECT pt.ProdType_ID, pt.TypeName,
            (SELECT COUNT(*) FROM prodtypespecs  WHERE ProdType_ID = pt.ProdType_ID) AS SpecCount,
            (SELECT COUNT(*) FROM prodtypeparams WHERE ProdType_ID = pt.ProdType_ID) AS ParamCount
     FROM   prodtypes pt WHERE pt.ProdType_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createProductFilter(name: string): Promise<number> {
  const rows = await query<{ ProdType_ID: number }>(
    `INSERT INTO prodtypes (TypeName) OUTPUT INSERTED.ProdType_ID VALUES (@name)`,
    { name }
  );
  return rows[0].ProdType_ID;
}

export async function updateProductFilter(id: number, name: string): Promise<void> {
  await query(`UPDATE prodtypes SET TypeName = @name WHERE ProdType_ID = @id`, { id, name });
}

export async function deleteProductFilter(id: number): Promise<void> {
  // Cascade: params → answer maps + product maps
  const params = await query<{ ProdTypeParam_ID: number }>(
    `SELECT ProdTypeParam_ID FROM prodtypeparams WHERE ProdType_ID = @id`, { id }
  );
  for (const p of params) {
    await query(`DELETE FROM prodtypeparam_answer_map WHERE Param_ID = @pid`, { pid: p.ProdTypeParam_ID });
    await query(`DELETE FROM prodtypeparam_product     WHERE ProdTypeParam_ID = @pid`, { pid: p.ProdTypeParam_ID });
  }
  await query(`DELETE FROM prodtypeparams WHERE ProdType_ID = @id`, { id });

  // Cascade: specs → product maps
  const specs = await query<{ ProdTypeSpec_ID: number }>(
    `SELECT ProdTypeSpec_ID FROM prodtypespecs WHERE ProdType_ID = @id`, { id }
  );
  for (const s of specs) {
    await query(`DELETE FROM prodtypespec_product WHERE ProdTypeSpec_ID = @sid`, { sid: s.ProdTypeSpec_ID });
  }
  await query(`DELETE FROM prodtypespecs WHERE ProdType_ID = @id`, { id });

  await query(`DELETE FROM prodtypes WHERE ProdType_ID = @id`, { id });
}

// ─── Custom Specifications ────────────────────────────────────────────────────

export interface ProdSpec {
  ProdTypeSpec_ID: number;
  ProdType_ID: number;
  Name: string;
  IsTitle: boolean;
  Priority: number;
}

export async function getSpecs(typeId: number): Promise<ProdSpec[]> {
  return query<ProdSpec>(
    `SELECT ProdTypeSpec_ID, ProdType_ID, Name, IsTitle, Priority
     FROM   prodtypespecs WHERE ProdType_ID = @typeId
     ORDER  BY Priority, Name`,
    { typeId }
  );
}

export interface SpecRow {
  id?: number;
  name: string;
  isTitle: boolean;
  priority: number;
  delete?: boolean;
}

export async function saveSpecs(typeId: number, rows: SpecRow[]): Promise<void> {
  for (const row of rows) {
    if (row.delete && row.id) {
      await query(`DELETE FROM prodtypespec_product WHERE ProdTypeSpec_ID = @id`, { id: row.id });
      await query(`DELETE FROM prodtypespecs          WHERE ProdTypeSpec_ID = @id`, { id: row.id });
    } else if (row.delete) {
      // new unsaved row — skip
    } else if (row.id) {
      await query(
        `UPDATE prodtypespecs SET Name=@name, IsTitle=@isTitle, Priority=@priority
         WHERE  ProdTypeSpec_ID = @id`,
        { id: row.id, name: row.name, isTitle: row.isTitle ? 1 : 0, priority: row.priority }
      );
    } else {
      await query(
        `INSERT INTO prodtypespecs (ProdType_ID, Name, IsTitle, Priority)
         VALUES (@typeId, @name, @isTitle, @priority)`,
        { typeId, name: row.name, isTitle: row.isTitle ? 1 : 0, priority: row.priority }
      );
    }
  }
}

// ─── Search Parameters ────────────────────────────────────────────────────────

export interface ProdParam {
  ProdTypeParam_ID: number;
  ProdType_ID: number;
  Name: string;
  Question: string;
  Priority: number;
  display: boolean;
  AlwaysOpen: boolean;
  AllowMultipleChoice: boolean;
  Parent_ID: number | null;
  Answer_ID: number | null;
  ParentName: string | null;
  ParentAnswerText: string | null;
  AnswerCount: number;
}

export async function getParams(typeId: number): Promise<ProdParam[]> {
  return query<ProdParam>(
    `SELECT p.ProdTypeParam_ID, p.ProdType_ID, p.Name, p.Question, p.Priority,
            p.display, p.AlwaysOpen, p.AllowMultipleChoice, p.Parent_ID, p.Answer_ID,
            parent.Name AS ParentName,
            pa.Answers  AS ParentAnswerText,
            (SELECT COUNT(*) FROM prodtypeparam_answer_map WHERE Param_ID = p.ProdTypeParam_ID) AS AnswerCount
     FROM   prodtypeparams p
     LEFT JOIN prodtypeparams          parent ON parent.ProdTypeParam_ID = p.Parent_ID
     LEFT JOIN prodtypeparam_answers   pa     ON pa.AnswerId = p.Answer_ID
     WHERE  p.ProdType_ID = @typeId
     ORDER  BY p.Priority, p.Name`,
    { typeId }
  );
}

export async function getParam(paramId: number): Promise<ProdParam | null> {
  const rows = await query<ProdParam>(
    `SELECT p.ProdTypeParam_ID, p.ProdType_ID, p.Name, p.Question, p.Priority,
            p.display, p.AlwaysOpen, p.AllowMultipleChoice, p.Parent_ID, p.Answer_ID,
            parent.Name AS ParentName,
            pa.Answers  AS ParentAnswerText,
            (SELECT COUNT(*) FROM prodtypeparam_answer_map WHERE Param_ID = p.ProdTypeParam_ID) AS AnswerCount
     FROM   prodtypeparams p
     LEFT JOIN prodtypeparams          parent ON parent.ProdTypeParam_ID = p.Parent_ID
     LEFT JOIN prodtypeparam_answers   pa     ON pa.AnswerId = p.Answer_ID
     WHERE  p.ProdTypeParam_ID = @paramId`,
    { paramId }
  );
  return rows[0] ?? null;
}

export interface ParamAnswer {
  AnswerId: number;
  Answers: string;
  Priority: number;
}

export async function getParamAnswers(paramId: number): Promise<ParamAnswer[]> {
  return query<ParamAnswer>(
    `SELECT a.AnswerId, a.Answers, a.Priority
     FROM   prodtypeparam_answers   a
     JOIN   prodtypeparam_answer_map m ON m.AnswerId = a.AnswerId
     WHERE  m.Param_ID = @paramId
     ORDER  BY a.Priority, a.AnswerId`,
    { paramId }
  );
}

export interface ParamData {
  name: string;
  question: string;
  priority: number;
  display: boolean;
  alwaysOpen: boolean;
  allowMultiple: boolean;
  parentId: number | null;
  answerId: number | null;
}

export interface AnswerRow {
  id?: number;      // existing AnswerId
  text: string;
  priority: number;
  delete?: boolean;
}

export async function createParam(typeId: number, data: ParamData, answers: AnswerRow[]): Promise<number> {
  const rows = await query<{ ProdTypeParam_ID: number }>(
    `INSERT INTO prodtypeparams
       (ProdType_ID, Name, Question, Priority, display, AlwaysOpen, AllowMultipleChoice, Parent_ID, Answer_ID)
     OUTPUT INSERTED.ProdTypeParam_ID
     VALUES (@typeId, @name, @question, @priority, @display, @alwaysOpen, @allowMultiple, @parentId, @answerId)`,
    {
      typeId,
      name: data.name,
      question: data.question,
      priority: data.priority,
      display: data.display ? 1 : 0,
      alwaysOpen: data.alwaysOpen ? 1 : 0,
      allowMultiple: data.allowMultiple ? 1 : 0,
      parentId: data.parentId ?? null,
      answerId: data.answerId ?? null,
    } as Record<string, string | number | null>
  );
  const paramId = rows[0].ProdTypeParam_ID;
  await _saveAnswers(paramId, answers);
  return paramId;
}

export async function updateParam(paramId: number, data: ParamData, answers: AnswerRow[]): Promise<void> {
  await query(
    `UPDATE prodtypeparams
     SET Name=@name, Question=@question, Priority=@priority,
         display=@display, AlwaysOpen=@alwaysOpen, AllowMultipleChoice=@allowMultiple,
         Parent_ID=@parentId, Answer_ID=@answerId
     WHERE ProdTypeParam_ID = @paramId`,
    {
      paramId,
      name: data.name,
      question: data.question,
      priority: data.priority,
      display: data.display ? 1 : 0,
      alwaysOpen: data.alwaysOpen ? 1 : 0,
      allowMultiple: data.allowMultiple ? 1 : 0,
      parentId: data.parentId ?? null,
      answerId: data.answerId ?? null,
    } as Record<string, string | number | null>
  );
  await _saveAnswers(paramId, answers);
}

async function _saveAnswers(paramId: number, answers: AnswerRow[]): Promise<void> {
  for (const ans of answers) {
    if (ans.delete && ans.id) {
      await query(`DELETE FROM prodtypeparam_answer_map WHERE Param_ID=@paramId AND AnswerId=@id`, { paramId, id: ans.id });
      // Only delete the answer record if no other params reference it
      const refs = await query<{ c: number }>(
        `SELECT COUNT(*) AS c FROM prodtypeparam_answer_map WHERE AnswerId=@id`, { id: ans.id }
      );
      if (refs[0].c === 0) {
        await query(`DELETE FROM prodtypeparam_answers WHERE AnswerId=@id`, { id: ans.id });
      }
    } else if (ans.delete) {
      // new unsaved — skip
    } else if (ans.id) {
      await query(
        `UPDATE prodtypeparam_answers SET Answers=@text, Priority=@priority WHERE AnswerId=@id`,
        { id: ans.id, text: ans.text, priority: ans.priority }
      );
    } else {
      // Insert answer, then map to param
      const inserted = await query<{ AnswerId: number }>(
        `INSERT INTO prodtypeparam_answers (Answers, Priority) OUTPUT INSERTED.AnswerId VALUES (@text, @priority)`,
        { text: ans.text, priority: ans.priority }
      );
      await query(
        `INSERT INTO prodtypeparam_answer_map (Param_ID, AnswerId) VALUES (@paramId, @aid)`,
        { paramId, aid: inserted[0].AnswerId }
      );
    }
  }
}

export async function deleteParam(paramId: number): Promise<void> {
  await query(`DELETE FROM prodtypeparam_answer_map WHERE Param_ID = @paramId`, { paramId });
  await query(`DELETE FROM prodtypeparam_product     WHERE ProdTypeParam_ID = @paramId`, { paramId });
  await query(`DELETE FROM prodtypeparams            WHERE ProdTypeParam_ID = @paramId`, { paramId });
}

export async function getAllParamsForType(typeId: number): Promise<{ ProdTypeParam_ID: number; Name: string }[]> {
  return query<{ ProdTypeParam_ID: number; Name: string }>(
    `SELECT ProdTypeParam_ID, Name FROM prodtypeparams WHERE ProdType_ID = @typeId ORDER BY Priority, Name`,
    { typeId }
  );
}

export async function getAnswersForParam(paramId: number): Promise<ParamAnswer[]> {
  return getParamAnswers(paramId);
}
