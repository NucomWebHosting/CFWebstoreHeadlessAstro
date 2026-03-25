import { query } from "../db";

// ── Tax Codes ──────────────────────────────────────────────────────────────────

export interface TaxCode {
  Code_ID: number;
  CodeName: string;
  DisplayName: string;
  TaxAll: boolean;
  ShowonProds: boolean;
  TaxRate: number;       // stored as decimal (0.08 = 8%)
  TaxShipping: boolean;
  TaxAddress: string;    // "Billing" | "Shipping"
  CalcOrder: number;
  Cumulative: boolean;
}

export async function getTaxCodes(): Promise<TaxCode[]> {
  return query<TaxCode>(
    "SELECT * FROM TaxCodes ORDER BY CalcOrder, CodeName"
  );
}

export async function getTaxCode(codeId: number): Promise<TaxCode | null> {
  const rows = await query<TaxCode>(
    "SELECT * FROM TaxCodes WHERE Code_ID = @codeId",
    { codeId }
  );
  return rows[0] ?? null;
}

export async function saveTaxCode(
  codeId: number,
  data: Omit<TaxCode, "Code_ID">
): Promise<void> {
  if (codeId === 0) {
    await query(
      `INSERT INTO TaxCodes
         (CodeName, DisplayName, TaxAll, ShowonProds, TaxRate, TaxShipping, TaxAddress, CalcOrder, Cumulative)
       VALUES
         (@CodeName, @DisplayName, @TaxAll, @ShowonProds, @TaxRate, @TaxShipping, @TaxAddress, @CalcOrder, @Cumulative)`,
      data
    );
  } else {
    await query(
      `UPDATE TaxCodes SET
         CodeName    = @CodeName,
         DisplayName = @DisplayName,
         TaxAll      = @TaxAll,
         ShowonProds = @ShowonProds,
         TaxRate     = @TaxRate,
         TaxShipping = @TaxShipping,
         TaxAddress  = @TaxAddress,
         CalcOrder   = @CalcOrder,
         Cumulative  = @Cumulative
       WHERE Code_ID = @codeId`,
      { ...data, codeId }
    );
  }
}

export async function deleteTaxCode(codeId: number): Promise<{ blocked: boolean }> {
  // Check for existing orders using this code
  const used = await query<{ cnt: number }>(
    "SELECT COUNT(*) AS cnt FROM OrderTaxes WHERE Code_ID = @codeId",
    { codeId }
  );
  if ((used[0]?.cnt ?? 0) > 0) return { blocked: true };

  await query("DELETE FROM LocalTax   WHERE Code_ID = @codeId", { codeId });
  await query("DELETE FROM StateTax   WHERE Code_ID = @codeId", { codeId });
  await query("DELETE FROM Counties   WHERE Code_ID = @codeId", { codeId });
  await query("DELETE FROM CountryTax WHERE Code_ID = @codeId", { codeId });
  await query("DELETE FROM TaxCodes   WHERE Code_ID = @codeId", { codeId });
  return { blocked: false };
}

export async function updateCalcOrders(
  updates: Array<{ codeId: number; calcOrder: number; cumulative: boolean }>
): Promise<void> {
  await Promise.all(
    updates.map(u =>
      query(
        "UPDATE TaxCodes SET CalcOrder = @calcOrder, Cumulative = @cumulative WHERE Code_ID = @codeId",
        u
      )
    )
  );
}

// ── State Tax ─────────────────────────────────────────────────────────────────

export interface StateTaxRow {
  Tax_ID: number;
  Code_ID: number;
  State: string;
  TaxRate: number;   // decimal
  TaxShip: boolean;
}

export async function getStateTaxes(codeId: number): Promise<StateTaxRow[]> {
  return query<StateTaxRow>(
    "SELECT * FROM StateTax WHERE Code_ID = @codeId ORDER BY State",
    { codeId }
  );
}

export async function saveStateTax(
  taxId: number, codeId: number, state: string, taxRate: number, taxShip: boolean
): Promise<void> {
  if (taxId === 0) {
    await query(
      "INSERT INTO StateTax (Code_ID, State, TaxRate, TaxShip) VALUES (@codeId, @state, @taxRate, @taxShip)",
      { codeId, state, taxRate, taxShip }
    );
  } else {
    await query(
      "UPDATE StateTax SET State = @state, TaxRate = @taxRate, TaxShip = @taxShip WHERE Tax_ID = @taxId",
      { taxId, state, taxRate, taxShip }
    );
  }
}

export async function deleteStateTax(taxId: number): Promise<void> {
  await query("DELETE FROM StateTax WHERE Tax_ID = @taxId", { taxId });
}

// ── County Tax ────────────────────────────────────────────────────────────────

export interface CountyTaxRow {
  County_ID: number;
  Code_ID: number;
  State: string;
  Name: string;
  TaxRate: number;
  TaxShip: boolean;
}

export async function getCountyTaxes(codeId: number): Promise<CountyTaxRow[]> {
  return query<CountyTaxRow>(
    "SELECT * FROM Counties WHERE Code_ID = @codeId ORDER BY State, Name",
    { codeId }
  );
}

export async function saveCountyTax(
  countyId: number, codeId: number, state: string, name: string, taxRate: number, taxShip: boolean
): Promise<void> {
  if (countyId === 0) {
    await query(
      "INSERT INTO Counties (Code_ID, Name, State, TaxRate, TaxShip) VALUES (@codeId, @name, @state, @taxRate, @taxShip)",
      { codeId, name, state, taxRate, taxShip }
    );
  } else {
    await query(
      "UPDATE Counties SET Name = @name, State = @state, TaxRate = @taxRate, TaxShip = @taxShip WHERE County_ID = @countyId",
      { countyId, name, state, taxRate, taxShip }
    );
  }
}

export async function deleteCountyTax(countyId: number): Promise<void> {
  await query("DELETE FROM Counties WHERE County_ID = @countyId", { countyId });
}

// ── Local (Zip) Tax ───────────────────────────────────────────────────────────

export interface LocalTaxRow {
  Tax_ID: number;
  Code_ID: number;
  ZipCode: string;
  EndZip: string | null;
  Tax: number;       // decimal — note column is "Tax" not "TaxRate"
  TaxShip: boolean;
}

export async function getLocalTaxes(codeId: number): Promise<LocalTaxRow[]> {
  return query<LocalTaxRow>(
    "SELECT * FROM LocalTax WHERE Code_ID = @codeId ORDER BY ZipCode",
    { codeId }
  );
}

export async function saveLocalTax(
  taxId: number, codeId: number, zipCode: string, endZip: string, tax: number, taxShip: boolean
): Promise<void> {
  if (taxId === 0) {
    await query(
      "INSERT INTO LocalTax (Code_ID, ZipCode, EndZip, Tax, TaxShip) VALUES (@codeId, @zipCode, @endZip, @tax, @taxShip)",
      { codeId, zipCode, endZip, tax, taxShip }
    );
  } else {
    await query(
      "UPDATE LocalTax SET ZipCode = @zipCode, EndZip = @endZip, Tax = @tax, TaxShip = @taxShip WHERE Tax_ID = @taxId",
      { taxId, zipCode, endZip, tax, taxShip }
    );
  }
}

export async function deleteLocalTax(taxId: number): Promise<void> {
  await query("DELETE FROM LocalTax WHERE Tax_ID = @taxId", { taxId });
}

// ── Country Tax ───────────────────────────────────────────────────────────────

export interface CountryTaxRow {
  Tax_ID: number;
  Code_ID: number;
  Country_ID: number;
  Name: string;
  TaxRate: number;
  TaxShip: boolean;
}

export interface CountryRow {
  ID: number;
  Name: string;
}

export async function getCountryTaxes(codeId: number): Promise<CountryTaxRow[]> {
  return query<CountryTaxRow>(
    `SELECT T.*, C.Name
     FROM CountryTax T
     INNER JOIN Countries C ON T.Country_ID = C.ID
     WHERE T.Code_ID = @codeId
     ORDER BY C.Name`,
    { codeId }
  );
}

export async function getAllCountries(): Promise<CountryRow[]> {
  return query<CountryRow>("SELECT ID, Name FROM Countries ORDER BY Name");
}

export async function saveCountryTax(
  taxId: number, codeId: number, countryId: number, taxRate: number, taxShip: boolean
): Promise<void> {
  if (taxId === 0) {
    await query(
      "INSERT INTO CountryTax (Code_ID, Country_ID, TaxRate, TaxShip) VALUES (@codeId, @countryId, @taxRate, @taxShip)",
      { codeId, countryId, taxRate, taxShip }
    );
  } else {
    await query(
      "UPDATE CountryTax SET Country_ID = @countryId, TaxRate = @taxRate, TaxShip = @taxShip WHERE Tax_ID = @taxId",
      { taxId, countryId, taxRate, taxShip }
    );
  }
}

export async function deleteCountryTax(taxId: number): Promise<void> {
  await query("DELETE FROM CountryTax WHERE Tax_ID = @taxId", { taxId });
}
