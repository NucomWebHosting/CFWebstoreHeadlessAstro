import { query } from "../db";

// ── Easypost Settings (Easypost table — single row, no WHERE) ─────────────

export interface EasypostSettings {
  EasyPostApiKey:     string;
  EasyPostCallURL:    string;
  MerchantFullName:   string;
  MerchantAddress1:   string;
  MerchantAddress2:   string;
  MerchantCity:       string;
  MerchantState:      string;
  MerchantZipcode:    string;
  MerchantPhone:      string;
  MerchantEmail:      string;
  NucomClientKey:     string;
  NucomClientSecret:  string;
  NucomAPIKey:        string;
  CFWebstoreURL:      string;
  NucomServicesURL:   string;
  nucomAccessToken:   string;
  UseShipBox:         number;   // 0=none,1=auto,2=manual,3=manual-multi
  customs_signer:     string;
  non_delivery_option: string;
  UseAV:              number;   // 0=off,1=warn,2=force
  Debug:              boolean;
  Email_Customer:     number;   // 0=off,1=shipped,2=delivered
  SMS_Customer:       number;
  rate_to_show:       number;   // 1=cheapest,2=fastest,3=all
  show_delivery_date: boolean;
  default_prep_days:  number;
  AddOneDay_Time:     string;   // time string e.g. "14:00"
  ShowShipFrom:       boolean;
}

export async function getEasypostSettings(): Promise<EasypostSettings | null> {
  const rows = await query<EasypostSettings>(
    `SELECT TOP 1
       EasyPostApiKey, EasyPostCallURL,
       MerchantFullName, MerchantAddress1, MerchantAddress2,
       MerchantCity, MerchantState, MerchantZipcode, MerchantPhone, MerchantEmail,
       NucomClientKey, NucomClientSecret, NucomAPIKey, CFWebstoreURL, NucomServicesURL, nucomAccessToken,
       UseShipBox, customs_signer, non_delivery_option, UseAV, Debug,
       Email_Customer, SMS_Customer, rate_to_show, show_delivery_date,
       default_prep_days, AddOneDay_Time, ShowShipFrom
     FROM Easypost`
  );
  return rows[0] ?? null;
}

export async function saveEasypostSettings(
  s: Omit<EasypostSettings, "nucomAccessToken">
): Promise<void> {
  await query(
    `UPDATE Easypost SET
       EasyPostApiKey      = @EasyPostApiKey,
       EasyPostCallURL     = @EasyPostCallURL,
       MerchantFullName    = @MerchantFullName,
       MerchantAddress1    = @MerchantAddress1,
       MerchantAddress2    = @MerchantAddress2,
       MerchantCity        = @MerchantCity,
       MerchantState       = @MerchantState,
       MerchantZipcode     = @MerchantZipcode,
       MerchantPhone       = @MerchantPhone,
       MerchantEmail       = @MerchantEmail,
       NucomClientKey      = @NucomClientKey,
       NucomClientSecret   = @NucomClientSecret,
       NucomAPIKey         = @NucomAPIKey,
       CFWebstoreURL       = @CFWebstoreURL,
       NucomServicesURL    = @NucomServicesURL,
       UseShipBox          = @UseShipBox,
       customs_signer      = @customs_signer,
       non_delivery_option = @non_delivery_option,
       UseAV               = @UseAV,
       Debug               = @Debug,
       Email_Customer      = @Email_Customer,
       SMS_Customer        = @SMS_Customer,
       rate_to_show        = @rate_to_show,
       show_delivery_date  = @show_delivery_date,
       default_prep_days   = @default_prep_days,
       AddOneDay_Time      = @AddOneDay_Time,
       ShowShipFrom        = @ShowShipFrom`,
    s
  );
}

// ── EasypostMethods ────────────────────────────────────────────────────────

export interface EasypostMethod {
  ID:            number;
  Name:          string;
  Friendly_Name: string;
  MethodHand:    number;  // stored as decimal e.g. 0.05 = 5%
  MethodWeight:  number;  // oz
  Priority:      number;
  Used:          boolean;
}

export async function getEasypostMethods(): Promise<EasypostMethod[]> {
  return query<EasypostMethod>(
    `SELECT ID, Name, Friendly_Name, MethodHand, MethodWeight, Priority, Used
     FROM EasypostMethods ORDER BY Priority, Name`
  );
}

export async function getEasypostMethod(id: number): Promise<EasypostMethod | null> {
  const rows = await query<EasypostMethod>(
    `SELECT ID, Name, Friendly_Name, MethodHand, MethodWeight, Priority, Used
     FROM EasypostMethods WHERE ID = @ID`,
    { ID: id }
  );
  return rows[0] ?? null;
}

export async function saveEasypostMethod(id: number, data: Omit<EasypostMethod, "ID">): Promise<void> {
  if (id === 0) {
    await query(
      `INSERT INTO EasypostMethods (Name, Friendly_Name, MethodHand, MethodWeight, Priority, Used)
       VALUES (@Name, @Friendly_Name, @MethodHand, @MethodWeight, @Priority, @Used)`,
      data
    );
  } else {
    await query(
      `UPDATE EasypostMethods SET
         Name          = @Name,
         Friendly_Name = @Friendly_Name,
         MethodHand    = @MethodHand,
         MethodWeight  = @MethodWeight,
         Priority      = @Priority,
         Used          = @Used
       WHERE ID = @ID`,
      { ID: id, ...data }
    );
  }
}

export async function deleteEasypostMethod(id: number): Promise<void> {
  await query(`DELETE FROM EasypostMethods WHERE ID = @ID`, { ID: id });
}

// ── Easypost_box_size ──────────────────────────────────────────────────────

export interface EasypostBox {
  box_ID:    number;
  Name:      string;
  Length:    number;
  Width:     number;
  Height:    number;
  weight:    number;   // dimensional weight (auto-calculated)
  packaging: number;   // actual box weight in oz
  Notes:     string;
}

export async function getEasypostBoxes(): Promise<EasypostBox[]> {
  return query<EasypostBox>(
    `SELECT box_ID, Name, Length, Width, Height, weight, packaging, Notes
     FROM Easypost_box_size ORDER BY Name`
  );
}

export async function getEasypostBox(id: number): Promise<EasypostBox | null> {
  const rows = await query<EasypostBox>(
    `SELECT box_ID, Name, Length, Width, Height, weight, packaging, Notes
     FROM Easypost_box_size WHERE box_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function saveEasypostBox(id: number, data: {
  Name: string; Length: number; Width: number; Height: number;
  weight: number; packaging: number; Notes: string;
}): Promise<void> {
  if (id === 0) {
    await query(
      `INSERT INTO Easypost_box_size (Name, Length, Width, Height, weight, packaging, Notes)
       VALUES (@Name, @Length, @Width, @Height, @weight, @packaging, @Notes)`,
      data
    );
  } else {
    await query(
      `UPDATE Easypost_box_size SET
         Name      = @Name,
         Length    = @Length,
         Width     = @Width,
         Height    = @Height,
         weight    = @weight,
         packaging = @packaging,
         Notes     = @Notes
       WHERE box_ID = @id`,
      { id, ...data }
    );
  }
}

export async function deleteEasypostBox(id: number): Promise<void> {
  await query(`DELETE FROM Easypost_box_size WHERE box_ID = @id`, { id });
}
