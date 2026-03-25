import { query } from "../db";

// ── ShipSettings (ID=1) ───────────────────────────────────────────────────

export interface ShipSettings {
  ID: number;
  ShipType: string;
  InStorePickup: boolean;
  ShowEstimator: boolean;
  ShowFreight: boolean;
  OverrideFreight: boolean;
  UseDropShippers: boolean;
  SingleShipmentOnly: boolean;
  ShowFrontEnd: boolean;
  ShipBase: number;
  ShipHand: number;         // stored as decimal e.g. 0.05 = 5%
  AllowNoShip: boolean;
  NoShipType: string | null;
  NoShipMess: string | null;
  // Free shipping promo
  Freeship_Min: number;
  Freeship_ShipIDs: string | null;   // comma-separated method IDs
  FreeShipAmtFlag: boolean;
  FreeShipStateFlag: boolean;
  FreeshipStates: string | null;
  // Flat rate promo
  Flatrate: number;
  Flatrate_min: number;
  Flatrate_domestic: number;   // 1=domestic, 0=international
}

export async function getShipSettings(): Promise<ShipSettings | null> {
  const rows = await query<ShipSettings>(
    `SELECT ID, ShipType,
            InStorePickup, ShowEstimator, ShowFreight, OverrideFreight,
            UseDropShippers, SingleShipmentOnly, ShowFrontEnd,
            ShipBase, ShipHand, AllowNoShip, NoShipType, NoShipMess,
            Freeship_Min, Freeship_ShipIDs, FreeShipAmtFlag, FreeShipStateFlag, FreeshipStates,
            Flatrate, Flatrate_min, Flatrate_domestic
     FROM ShipSettings WHERE ID = 1`
  );
  return rows[0] ?? null;
}

export async function saveShipSettings(s: Omit<ShipSettings,
  "ID" | "Freeship_Min" | "Freeship_ShipIDs" | "FreeShipAmtFlag" | "FreeShipStateFlag" |
  "FreeshipStates" | "Flatrate" | "Flatrate_min" | "Flatrate_domestic">
): Promise<void> {
  await query(
    `UPDATE ShipSettings SET
       ShipType          = @ShipType,
       InStorePickup     = @InStorePickup,
       ShowEstimator     = @ShowEstimator,
       ShowFreight       = @ShowFreight,
       OverrideFreight   = @OverrideFreight,
       UseDropShippers   = @UseDropShippers,
       SingleShipmentOnly= @SingleShipmentOnly,
       ShowFrontEnd      = @ShowFrontEnd,
       ShipBase          = @ShipBase,
       ShipHand          = @ShipHand,
       AllowNoShip       = @AllowNoShip,
       NoShipType        = @NoShipType,
       NoShipMess        = @NoShipMess
     WHERE ID = 1`,
    s
  );
}

export async function saveFreeShipping(data: {
  Freeship_Min: number;
  Freeship_ShipIDs: string;
  FreeShipAmtFlag: boolean;
  FreeShipStateFlag: boolean;
  FreeshipStates: string;
}): Promise<void> {
  await query(
    `UPDATE ShipSettings SET
       Freeship_Min       = @Freeship_Min,
       Freeship_ShipIDs   = @Freeship_ShipIDs,
       FreeShipAmtFlag    = @FreeShipAmtFlag,
       FreeShipStateFlag  = @FreeShipStateFlag,
       FreeshipStates     = @FreeshipStates
     WHERE ID = 1`,
    data
  );
}

export async function saveFlatRate(data: {
  Flatrate: number;
  Flatrate_min: number;
  Flatrate_domestic: number;
}): Promise<void> {
  await query(
    `UPDATE ShipSettings SET
       Flatrate          = @Flatrate,
       Flatrate_min      = @Flatrate_min,
       Flatrate_domestic = @Flatrate_domestic
     WHERE ID = 1`,
    data
  );
}

// ── Custom Rates (Shipping table) ─────────────────────────────────────────

export interface ShipRate {
  ID: number;
  Table_Id: number;
  MinOrder: number;
  MaxOrder: number;
  Amount: number;  // dollar for Price/Weight/Items; decimal for Price2/Weight2 (e.g. 0.1=10%)
}

export async function getShipRates(tableId: 1 | 2): Promise<ShipRate[]> {
  return query<ShipRate>(
    `SELECT ID, Table_Id, MinOrder, MaxOrder, Amount FROM Shipping WHERE Table_Id = @tableId ORDER BY MinOrder`,
    { tableId }
  );
}

export async function saveShipRate(id: number, tableId: number, data: {
  MinOrder: number; MaxOrder: number; Amount: number;
}): Promise<void> {
  if (id === 0) {
    await query(
      `INSERT INTO Shipping (Table_Id, MinOrder, MaxOrder, Amount) VALUES (@Table_Id, @MinOrder, @MaxOrder, @Amount)`,
      { Table_Id: tableId, ...data }
    );
  } else {
    await query(
      `UPDATE Shipping SET MinOrder = @MinOrder, MaxOrder = @MaxOrder, Amount = @Amount WHERE ID = @ID`,
      { ID: id, ...data }
    );
  }
}

export async function deleteShipRate(id: number): Promise<void> {
  await query(`DELETE FROM Shipping WHERE ID = @ID`, { ID: id });
}

// ── Country Rates (Countries table) ──────────────────────────────────────

export interface CountryRate {
  ID: number;
  Abbrev: string;
  Name: string;
  AddShipAmount: number;  // decimal e.g. 0.1 = 10%
}

export interface CountryRow {
  ID: number;
  Abbrev: string;
  Name: string;
}

export async function getCountryRates(): Promise<CountryRate[]> {
  return query<CountryRate>(
    `SELECT ID, Abbrev, Name, AddShipAmount FROM Countries WHERE Shipping = 1 ORDER BY Name`
  );
}

export async function getAllCountriesForShipping(): Promise<CountryRow[]> {
  return query<CountryRow>(
    `SELECT ID, Abbrev, Name FROM Countries ORDER BY Name`
  );
}

export async function saveCountryRate(id: number, abbrev: string, pct: number): Promise<void> {
  if (id === 0) {
    await query(
      `UPDATE Countries SET Shipping = 1, AddShipAmount = @pct WHERE Abbrev = @abbrev`,
      { pct, abbrev }
    );
  } else {
    await query(
      `UPDATE Countries SET AddShipAmount = @pct WHERE ID = @ID`,
      { ID: id, pct }
    );
  }
}

export async function setAllCountryRates(pct: number): Promise<void> {
  await query(`UPDATE Countries SET Shipping = 1, AddShipAmount = @pct`, { pct });
}

export async function deleteCountryRate(id: number): Promise<void> {
  await query(`UPDATE Countries SET Shipping = 0, AddShipAmount = 0 WHERE ID = @ID`, { ID: id });
}

// ── Custom Methods (CustomMethods table) ──────────────────────────────────

export interface ShipMethod {
  ID: number;
  Name: string;
  Amount: number;
  Used: boolean;
  Domestic: boolean;
  International: boolean;
  Priority: number;
}

export async function getShipMethods(): Promise<ShipMethod[]> {
  return query<ShipMethod>(
    `SELECT ID, Name, Amount, Used, Domestic, International, Priority FROM CustomMethods ORDER BY Priority, Name`
  );
}

export async function getShipMethod(id: number): Promise<ShipMethod | null> {
  const rows = await query<ShipMethod>(
    `SELECT ID, Name, Amount, Used, Domestic, International, Priority FROM CustomMethods WHERE ID = @ID`,
    { ID: id }
  );
  return rows[0] ?? null;
}

export async function saveShipMethod(id: number, data: Omit<ShipMethod, "ID">): Promise<void> {
  if (id === 0) {
    await query(
      `INSERT INTO CustomMethods (Name, Amount, Used, Domestic, International, Priority)
       VALUES (@Name, @Amount, @Used, @Domestic, @International, @Priority)`,
      data
    );
  } else {
    await query(
      `UPDATE CustomMethods SET Name=@Name, Amount=@Amount, Used=@Used,
         Domestic=@Domestic, International=@International, Priority=@Priority
       WHERE ID = @ID`,
      { ID: id, ...data }
    );
  }
}

export async function deleteShipMethod(id: number): Promise<void> {
  await query(`DELETE FROM CustomMethods WHERE ID = @ID`, { ID: id });
}

export async function saveMethodsUsedAndPriority(
  updates: Array<{ ID: number; Used: boolean; Priority: number }>
): Promise<void> {
  await Promise.all(
    updates.map(u =>
      query(
        `UPDATE CustomMethods SET Used = @Used, Priority = @Priority WHERE ID = @ID`,
        u
      )
    )
  );
}

// ── Custom Ship Settings (CustomShipSettings table) ───────────────────────

export interface CustomShipSettings {
  ShowShipTable: boolean;
  MultPerItem: boolean;
  CumulativeAmounts: boolean;
  MultMethods: boolean;
  Debug: boolean;
}

export async function getCustomShipSettings(): Promise<CustomShipSettings | null> {
  const rows = await query<CustomShipSettings>(
    `SELECT ShowShipTable, MultPerItem, CumulativeAmounts, MultMethods, Debug FROM CustomShipSettings`
  );
  return rows[0] ?? null;
}

export async function saveCustomShipSettings(s: CustomShipSettings): Promise<void> {
  await query(
    `UPDATE CustomShipSettings SET
       ShowShipTable      = @ShowShipTable,
       MultPerItem        = @MultPerItem,
       CumulativeAmounts  = @CumulativeAmounts,
       MultMethods        = @MultMethods,
       Debug              = @Debug`,
    s
  );
}

// ── States (for free shipping state selector) ─────────────────────────────

export interface StateRow { Abb: string; Name: string; }

export async function getStates(): Promise<StateRow[]> {
  return query<StateRow>(`SELECT Abb, Name FROM States ORDER BY Name`);
}
