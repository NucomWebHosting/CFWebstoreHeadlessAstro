import { query } from "../db";

export interface GiftwrapOption {
  Giftwrap_ID: number;
  Name:        string;
  Short_Desc:  string | null;
  Sm_Image:    string | null;
  Price:       number;
  Weight:      number;
  Priority:    number;
  Display:     boolean;
}

export async function getGiftwraps(): Promise<GiftwrapOption[]> {
  return query<GiftwrapOption>(`
    SELECT Giftwrap_ID, Name, Short_Desc, Sm_Image, Price, Weight, Priority, Display
    FROM   Giftwrap
    ORDER  BY Priority, Name
  `);
}

export async function getGiftwrap(id: number): Promise<GiftwrapOption | null> {
  const rows = await query<GiftwrapOption>(
    `SELECT Giftwrap_ID, Name, Short_Desc, Sm_Image, Price, Weight, Priority, Display
     FROM   Giftwrap WHERE Giftwrap_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function createGiftwrap(data: {
  Name: string; Short_Desc: string; Sm_Image: string;
  Price: number; Weight: number; Priority: number; Display: number;
}): Promise<void> {
  await query(
    `INSERT INTO Giftwrap (Name, Short_Desc, Sm_Image, Price, Weight, Priority, Display)
     VALUES (@Name, @Short_Desc, @Sm_Image, @Price, @Weight, @Priority, @Display)`,
    data
  );
}

export async function updateGiftwrap(id: number, data: {
  Name: string; Short_Desc: string; Sm_Image: string;
  Price: number; Weight: number; Priority: number; Display: number;
}): Promise<void> {
  await query(
    `UPDATE Giftwrap
     SET Name=@Name, Short_Desc=@Short_Desc, Sm_Image=@Sm_Image,
         Price=@Price, Weight=@Weight, Priority=@Priority, Display=@Display
     WHERE Giftwrap_ID=@id`,
    { ...data, id }
  );
}

export async function deleteGiftwrap(id: number): Promise<void> {
  await query(`DELETE FROM Giftwrap WHERE Giftwrap_ID = @id`, { id });
}
