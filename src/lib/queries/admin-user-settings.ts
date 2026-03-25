import { query } from "../db";

export interface UserSettings {
  UseRememberMe: boolean;
  EmailAsName: boolean;
  StrictLogins: boolean;
  MaxDailyLogins: number;
  MaxFailures: number;
  UseStateList: boolean;
  UseStateBox: boolean;
  RequireCounty: boolean;
  UseCountryList: boolean;
  UseResidential: boolean;
  UseTaxID: boolean;
  UseCustomerShipping: boolean;
  UseGroupCode: boolean;
  UseBirthdate: boolean;
  UseTerms: boolean;
  TermsText: string | null;
  UseCCard: boolean;
  UseEmailConf: boolean;
  UseEmailNotif: boolean;
  MemberNotify: boolean;
  AllowAffs: boolean;
  AffPercent: number; // stored as decimal e.g. 0.05 = 5%
  AllowWholesale: boolean;
  UseShipTo: boolean;
  UseAccounts: boolean;
  ShowAccount: boolean;
  ShowDirectory: boolean;
  ShowSubscribe: boolean;
  SubscribeCustomer: boolean;
}

export async function getUserSettings(): Promise<UserSettings | null> {
  const rows = await query<UserSettings>(
    `SELECT UseRememberMe, EmailAsName, StrictLogins, MaxDailyLogins, MaxFailures,
            UseStateList, UseStateBox, RequireCounty, UseCountryList, UseResidential,
            UseTaxID, UseCustomerShipping, UseGroupCode, UseBirthdate, UseTerms, TermsText,
            UseCCard, UseEmailConf, UseEmailNotif, MemberNotify, AllowAffs, AffPercent,
            AllowWholesale, UseShipTo, UseAccounts, ShowAccount, ShowDirectory,
            ShowSubscribe, SubscribeCustomer
     FROM UserSettings`,
    {}
  );
  return rows[0] ?? null;
}

export async function saveUserSettings(s: {
  UseRememberMe: boolean;
  EmailAsName: boolean;
  StrictLogins: boolean;
  MaxDailyLogins: number;
  MaxFailures: number;
  UseStateList: boolean;
  UseStateBox: boolean;
  RequireCounty: boolean;
  UseCountryList: boolean;
  UseResidential: boolean;
  UseTaxID: boolean;
  UseCustomerShipping: boolean;
  UseGroupCode: boolean;
  UseBirthdate: boolean;
  UseTerms: boolean;
  TermsText: string;
  UseCCard: boolean;
  UseEmailConf: boolean;
  UseEmailNotif: boolean;
  MemberNotify: boolean;
  AllowAffs: boolean;
  AffPercent: number; // already converted to decimal before calling
  AllowWholesale: boolean;
  UseShipTo: boolean;
  UseAccounts: boolean;
  ShowAccount: boolean;
  ShowDirectory: boolean;
  ShowSubscribe: boolean;
  SubscribeCustomer: boolean;
}): Promise<void> {
  await query(
    `UPDATE UserSettings SET
       UseRememberMe      = @UseRememberMe,
       EmailAsName        = @EmailAsName,
       StrictLogins       = @StrictLogins,
       MaxDailyLogins     = @MaxDailyLogins,
       MaxFailures        = @MaxFailures,
       UseStateList       = @UseStateList,
       UseStateBox        = @UseStateBox,
       RequireCounty      = @RequireCounty,
       UseCountryList     = @UseCountryList,
       UseResidential     = @UseResidential,
       UseTaxID           = @UseTaxID,
       UseCustomerShipping= @UseCustomerShipping,
       UseGroupCode       = @UseGroupCode,
       UseBirthdate       = @UseBirthdate,
       UseTerms           = @UseTerms,
       TermsText          = @TermsText,
       UseCCard           = @UseCCard,
       UseEmailConf       = @UseEmailConf,
       UseEmailNotif      = @UseEmailNotif,
       MemberNotify       = @MemberNotify,
       AllowAffs          = @AllowAffs,
       AffPercent         = @AffPercent,
       AllowWholesale     = @AllowWholesale,
       UseShipTo          = @UseShipTo,
       UseAccounts        = @UseAccounts,
       ShowAccount        = @ShowAccount,
       ShowDirectory      = @ShowDirectory,
       ShowSubscribe      = @ShowSubscribe,
       SubscribeCustomer  = @SubscribeCustomer`,
    s
  );
}
