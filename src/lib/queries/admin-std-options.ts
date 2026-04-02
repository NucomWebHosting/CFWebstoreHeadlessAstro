import { query } from "../db";

export interface StdOption {
  Std_ID:               number;
  Std_Name:             string;
  Std_Prompt:           string | null;
  Std_Desc:             string | null;
  Std_ShowPrice:        string | null;   // 'No' | 'AddPrice' | 'Total'
  Std_Display:          boolean;
  Std_Required:         boolean;
  Std_ColorDisplay:     number | null;   // 1–9
  Std_UseOptImageIncart: boolean;
  Std_Text:             string | null;
}

export interface StdOptChoice {
  Choice_ID:        number;
  Std_ID:           number;
  ChoiceName:       string;
  Price:            number;
  Price_Wholesale:  number;
  Weight:           number;
  Sm_Image1:        string | null;
  Md_Image1:        string | null;
  Lg_Image1:        string | null;
  optionTextColor:  string | null;
  SortOrder:        number;
  Display:          boolean;
}

export interface StdOptionFilters {
  name?:     string;
  display?:  string; // '1' | '0'
  required?: string; // '1' | '0'
}

export const DISPLAY_STYLES: Record<number, string> = {
  1: "Dropdown",
  2: "Small Image",
  3: "Dropdown + Button (modal)",
  4: "Small Image + large image swap",
  5: "Small Image + name & price in box",
  6: "Color — styled small image only",
  7: "Size — small box with text",
  8: "One per row — small box with text",
  9: "Color — small image in dropdown",
};

export async function getStdOptions(filters: StdOptionFilters = {}): Promise<StdOption[]> {
  const conditions: string[] = [];
  const params: Record<string, string | number> = {};

  if (filters.name) {
    conditions.push("Std_Name LIKE @name");
    params.name = `%${filters.name}%`;
  }
  if (filters.display === "1") conditions.push("Std_Display = 1");
  else if (filters.display === "0") conditions.push("Std_Display = 0");
  if (filters.required === "1") conditions.push("Std_Required = 1");
  else if (filters.required === "0") conditions.push("Std_Required = 0");

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return query<StdOption>(
    `SELECT Std_ID, Std_Name, Std_Prompt, Std_Desc, Std_ShowPrice,
            Std_Display, Std_Required, Std_ColorDisplay, Std_UseOptImageIncart, Std_Text
     FROM   StdOptions ${where}
     ORDER  BY Std_Name`,
    params
  );
}

export async function getStdOption(id: number): Promise<StdOption | null> {
  const rows = await query<StdOption>(
    `SELECT Std_ID, Std_Name, Std_Prompt, Std_Desc, Std_ShowPrice,
            Std_Display, Std_Required, Std_ColorDisplay, Std_UseOptImageIncart, Std_Text
     FROM   StdOptions WHERE Std_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function getStdOptChoices(stdId: number): Promise<StdOptChoice[]> {
  return query<StdOptChoice>(
    `SELECT Choice_ID, Std_ID, ChoiceName, Price, Price_Wholesale, Weight,
            Sm_Image1, Md_Image1, Lg_Image1, optionTextColor, SortOrder, Display
     FROM   StdOpt_Choices
     WHERE  Std_ID = @stdId
     ORDER  BY SortOrder, Choice_ID`,
    { stdId }
  );
}

export interface StdOptionData {
  Std_Name:              string;
  Std_Prompt:            string;
  Std_Desc:              string;
  Std_ShowPrice:         string;
  Std_Display:           number;
  Std_Required:          number;
  Std_ColorDisplay:      number;
  Std_UseOptImageIncart: number;
  Std_Text:              string;
}

export interface ChoiceData {
  ChoiceName:       string;
  Price:            number;
  Price_Wholesale:  number;
  Weight:           number;
  Sm_Image1:        string;
  Md_Image1:        string;
  Lg_Image1:        string;
  optionTextColor:  string;
  SortOrder:        number;
  Display:          number;
}

export async function createStdOption(data: StdOptionData, choices: ChoiceData[]): Promise<number> {
  const result = await query<{ Std_ID: number }>(
    `INSERT INTO StdOptions
       (Std_Name, Std_Prompt, Std_Desc, Std_ShowPrice, Std_Display, Std_Required,
        Std_ColorDisplay, Std_UseOptImageIncart, Std_Text)
     OUTPUT INSERTED.Std_ID
     VALUES (@Std_Name, @Std_Prompt, @Std_Desc, @Std_ShowPrice, @Std_Display, @Std_Required,
             @Std_ColorDisplay, @Std_UseOptImageIncart, @Std_Text)`,
    data as unknown as Record<string, string | number>
  );
  const stdId = result[0].Std_ID;
  for (const c of choices) {
    if (!c.ChoiceName.trim()) continue;
    await insertChoice(stdId, c);
  }
  return stdId;
}

export async function updateStdOption(id: number, data: StdOptionData): Promise<void> {
  await query(
    `UPDATE StdOptions
     SET Std_Name=@Std_Name, Std_Prompt=@Std_Prompt, Std_Desc=@Std_Desc,
         Std_ShowPrice=@Std_ShowPrice, Std_Display=@Std_Display, Std_Required=@Std_Required,
         Std_ColorDisplay=@Std_ColorDisplay, Std_UseOptImageIncart=@Std_UseOptImageIncart,
         Std_Text=@Std_Text
     WHERE Std_ID=@id`,
    { ...data, id } as unknown as Record<string, string | number>
  );
}

async function insertChoice(stdId: number, c: ChoiceData): Promise<void> {
  // Choice_ID is not an IDENTITY column — generate MAX+1 per Std_ID (mirrors CF logic)
  const maxRow = await query<{ newid: number | null }>(
    `SELECT MAX(Choice_ID) + 1 AS newid FROM StdOpt_Choices WHERE Std_ID = @stdId`,
    { stdId }
  );
  const choiceId = maxRow[0]?.newid ?? 1;

  await query(
    `INSERT INTO StdOpt_Choices
       (Std_ID, Choice_ID, ChoiceName, Price, Price_Wholesale, Weight, Sm_Image1, Md_Image1, Lg_Image1,
        optionTextColor, SortOrder, Display)
     VALUES (@stdId, @choiceId, @ChoiceName, @Price, @Price_Wholesale, @Weight, @Sm_Image1, @Md_Image1,
             @Lg_Image1, @optionTextColor, @SortOrder, @Display)`,
    {
      stdId,
      choiceId,
      ChoiceName:      c.ChoiceName,
      Price:           c.Price,
      Price_Wholesale: c.Price_Wholesale,
      Weight:          c.Weight,
      Sm_Image1:       c.Sm_Image1  || null,
      Md_Image1:       c.Md_Image1  || null,
      Lg_Image1:       c.Lg_Image1  || null,
      optionTextColor: c.optionTextColor || null,
      SortOrder:       c.SortOrder,
      Display:         c.Display,
    } as Record<string, string | number | null>
  );
}

export async function updateChoice(choiceId: number, stdId: number, c: ChoiceData): Promise<void> {
  await query(
    `UPDATE StdOpt_Choices
     SET ChoiceName=@ChoiceName, Price=@Price, Price_Wholesale=@Price_Wholesale,
         Weight=@Weight, Sm_Image1=@Sm_Image1, Md_Image1=@Md_Image1, Lg_Image1=@Lg_Image1,
         optionTextColor=@optionTextColor, SortOrder=@SortOrder, Display=@Display
     WHERE Choice_ID=@choiceId AND Std_ID=@stdId`,
    {
      choiceId, stdId,
      ChoiceName:      c.ChoiceName,
      Price:           c.Price,
      Price_Wholesale: c.Price_Wholesale,
      Weight:          c.Weight,
      Sm_Image1:       c.Sm_Image1  || null,
      Md_Image1:       c.Md_Image1  || null,
      Lg_Image1:       c.Lg_Image1  || null,
      optionTextColor: c.optionTextColor || null,
      SortOrder:       c.SortOrder,
      Display:         c.Display,
    } as Record<string, string | number | null>
  );
}

export async function deleteChoice(choiceId: number, stdId: number): Promise<void> {
  await query(
    `DELETE FROM StdOpt_Choices WHERE Choice_ID=@choiceId AND Std_ID=@stdId`,
    { choiceId, stdId }
  );
}

export async function addChoice(stdId: number, c: ChoiceData): Promise<void> {
  await insertChoice(stdId, c);
}

export async function deleteStdOption(id: number): Promise<void> {
  await query(`DELETE FROM StdOpt_Choices WHERE Std_ID=@id`, { id });
  await query(`DELETE FROM StdOptions WHERE Std_ID=@id`, { id });
}

// Parse choice rows from flat form fields (choice_name_0, choice_price_0, …)
export function parseChoicesFromForm(form: FormData, count: number): Array<{ id: number | null; data: ChoiceData; delete: boolean }> {
  const results = [];
  for (let i = 0; i < count; i++) {
    const name = (form.get(`choice_name_${i}`) as string ?? "").trim();
    if (!name) continue;
    results.push({
      id:     parseInt(form.get(`choice_id_${i}`) as string) || null,
      delete: form.get(`choice_delete_${i}`) === "1",
      data: {
        ChoiceName:      name,
        Price:           parseFloat(form.get(`choice_price_${i}`) as string)    || 0,
        Price_Wholesale: parseFloat(form.get(`choice_price_ws_${i}`) as string) || 0,
        Weight:          parseFloat(form.get(`choice_weight_${i}`) as string)   || 0,
        Sm_Image1:       (form.get(`choice_sm_${i}`)    as string ?? "").trim(),
        Md_Image1:       (form.get(`choice_md_${i}`)    as string ?? "").trim(),
        Lg_Image1:       (form.get(`choice_lg_${i}`)    as string ?? "").trim(),
        optionTextColor: (form.get(`choice_color_text_${i}`) as string ?? "").trim(),
        SortOrder:       parseInt(form.get(`choice_sort_${i}`) as string) || 9999,
        Display:         form.get(`choice_display_${i}`) === "1" ? 1 : 0,
      } as ChoiceData,
    });
  }
  return results;
}
