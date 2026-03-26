import { query } from "../db";

export interface StdAddon {
  Std_ID:              number;
  Std_Name:            string;
  Std_Prompt:          string | null;
  Std_Desc:            string | null;
  Std_Message:         string | null;
  Std_Type:            string;   // textbox | checkbox | quantity | textfield | calendar
  Std_Price:           number;
  Std_Price_Wholesale: number;
  Std_Weight:          number;
  Std_Display:         boolean;
  Std_ProdMult:        boolean;
  Std_Required:        boolean;
}

export const ADDON_TYPES: Record<string, string> = {
  textbox:   "Textfield (single line)",
  checkbox:  "Checkbox",
  quantity:  "Quantity",
  textfield: "Textbox (multiple lines)",
  calendar:  "Calendar",
};

export interface StdAddonFilters {
  name?:     string;
  type?:     string;
  display?:  string;
  required?: string;
}

export async function getStdAddons(filters: StdAddonFilters = {}): Promise<StdAddon[]> {
  const conditions: string[] = [];
  const params: Record<string, string | number> = {};

  if (filters.name) {
    conditions.push("Std_Name LIKE @name");
    params.name = `%${filters.name}%`;
  }
  if (filters.type) {
    conditions.push("Std_Type = @type");
    params.type = filters.type;
  }
  if (filters.display === "1") conditions.push("Std_Display = 1");
  else if (filters.display === "0") conditions.push("Std_Display = 0");
  if (filters.required === "1") conditions.push("Std_Required = 1");
  else if (filters.required === "0") conditions.push("Std_Required = 0");

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return query<StdAddon>(
    `SELECT Std_ID, Std_Name, Std_Prompt, Std_Desc, Std_Message, Std_Type,
            Std_Price, Std_Price_Wholesale, Std_Weight, Std_Display, Std_ProdMult, Std_Required
     FROM   StdAddons ${where}
     ORDER  BY Std_Name`,
    params
  );
}

export async function getStdAddon(id: number): Promise<StdAddon | null> {
  const rows = await query<StdAddon>(
    `SELECT Std_ID, Std_Name, Std_Prompt, Std_Desc, Std_Message, Std_Type,
            Std_Price, Std_Price_Wholesale, Std_Weight, Std_Display, Std_ProdMult, Std_Required
     FROM   StdAddons WHERE Std_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export interface StdAddonData {
  Std_Name:            string;
  Std_Prompt:          string;
  Std_Desc:            string;
  Std_Message:         string;
  Std_Type:            string;
  Std_Price:           number;
  Std_Price_Wholesale: number;
  Std_Weight:          number;
  Std_Display:         number;
  Std_ProdMult:        number;
  Std_Required:        number;
}

export async function createStdAddon(data: StdAddonData): Promise<number> {
  const result = await query<{ Std_ID: number }>(
    `INSERT INTO StdAddons
       (Std_Name, Std_Prompt, Std_Desc, Std_Message, Std_Type,
        Std_Price, Std_Price_Wholesale, Std_Weight, Std_Display, Std_ProdMult, Std_Required)
     OUTPUT INSERTED.Std_ID
     VALUES (@Std_Name, @Std_Prompt, @Std_Desc, @Std_Message, @Std_Type,
             @Std_Price, @Std_Price_Wholesale, @Std_Weight, @Std_Display, @Std_ProdMult, @Std_Required)`,
    data as unknown as Record<string, string | number>
  );
  return result[0].Std_ID;
}

export async function updateStdAddon(id: number, data: StdAddonData): Promise<void> {
  await query(
    `UPDATE StdAddons
     SET Std_Name=@Std_Name, Std_Prompt=@Std_Prompt, Std_Desc=@Std_Desc,
         Std_Message=@Std_Message, Std_Type=@Std_Type,
         Std_Price=@Std_Price, Std_Price_Wholesale=@Std_Price_Wholesale,
         Std_Weight=@Std_Weight, Std_Display=@Std_Display,
         Std_ProdMult=@Std_ProdMult, Std_Required=@Std_Required
     WHERE Std_ID=@id`,
    { ...data, id } as unknown as Record<string, string | number>
  );
}

export async function deleteStdAddon(id: number): Promise<void> {
  await query(`DELETE FROM ProdAddons WHERE Standard_ID = @id`, { id });
  await query(`DELETE FROM StdAddons WHERE Std_ID = @id`, { id });
}
