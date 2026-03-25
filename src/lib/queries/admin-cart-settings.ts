import { query } from "../db";

export interface CartSettings {
  // Shopping Options
  ShowBasket: boolean;
  ShowSFL: boolean;
  ShowRAC: boolean;
  GiftWrap: boolean;
  Coupons: boolean;
  GiftCard: boolean;
  Delivery: boolean;
  Backorders: boolean;
  // From Settings table
  GiftRegistry: boolean;
  Wishlists: boolean;

  // Checkout Options
  MinTotal: number;
  MinTotal_Wholesale: number;
  AllowInt: boolean;
  SkipAddressForm: boolean;
  NoGuests: boolean;
  BaseOrderNum: number;

  // Google Address
  AllowGoogleAutocomplete: boolean;
  AllowGoogleValidateAddress: boolean;
  AllowBadAddress: boolean;

  // Terms
  ShowTermsInCheckout: boolean;
  AgreeTerms: string | null;

  // Custom Checkout Fields
  CustomText1: string | null;
  CustomText2: string | null;
  CustomText3: string | null;
  CustomSelect1: string | null;
  CustomChoices1: string | null;
  CustomSelect2: string | null;
  CustomChoices2: string | null;
  CustomText_Req: string | null;    // comma-separated list e.g. "CustomText1,CustomText2"
  CustomSelect_Req: string | null;

  // Email Confirmations
  EmailUser: boolean;
  EmailAdmin: boolean;
  EmailAffs: boolean;
  EmailDrop: boolean;
  EmailDropWhen: string | null;   // "Placed" | "Processed" | "Filled"
  OrderEmail: string | null;
  DropEmail: string | null;
}

export async function getCartSettings(): Promise<CartSettings | null> {
  const [orderRows, settingsRows] = await Promise.all([
    query<Omit<CartSettings, "GiftRegistry" | "Wishlists">>(
      `SELECT
         ShowBasket, ShowSFL, ShowRAC, GiftWrap, Coupons, GiftCard, Delivery, Backorders,
         MinTotal, MinTotal_Wholesale, AllowInt, SkipAddressForm, NoGuests, BaseOrderNum,
         AllowGoogleAutocomplete, AllowGoogleValidateAddress, AllowBadAddress,
         ShowTermsInCheckout, AgreeTerms,
         CustomText1, CustomText2, CustomText3,
         CustomSelect1, CustomChoices1, CustomSelect2, CustomChoices2,
         CustomText_Req, CustomSelect_Req,
         EmailUser, EmailAdmin, EmailAffs, EmailDrop, EmailDropWhen,
         OrderEmail, DropEmail
       FROM OrderSettings`
    ),
    query<{ GiftRegistry: boolean; Wishlists: boolean }>(
      "SELECT GiftRegistry, Wishlists FROM Settings"
    ),
  ]);

  if (!orderRows[0]) return null;
  return {
    ...orderRows[0],
    GiftRegistry: settingsRows[0]?.GiftRegistry ?? false,
    Wishlists:    settingsRows[0]?.Wishlists    ?? false,
  };
}

export async function saveCartSettings(s: CartSettings): Promise<void> {
  await Promise.all([
    query(
      `UPDATE OrderSettings SET
         ShowBasket  = @ShowBasket,  ShowSFL  = @ShowSFL,   ShowRAC  = @ShowRAC,
         GiftWrap    = @GiftWrap,    Coupons  = @Coupons,   GiftCard = @GiftCard,
         Delivery    = @Delivery,    Backorders = @Backorders,
         MinTotal    = @MinTotal,    MinTotal_Wholesale = @MinTotal_Wholesale,
         AllowInt    = @AllowInt,    SkipAddressForm = @SkipAddressForm,
         NoGuests    = @NoGuests,    BaseOrderNum = @BaseOrderNum,
         AllowGoogleAutocomplete    = @AllowGoogleAutocomplete,
         AllowGoogleValidateAddress = @AllowGoogleValidateAddress,
         AllowBadAddress            = @AllowBadAddress,
         ShowTermsInCheckout = @ShowTermsInCheckout,
         AgreeTerms  = @AgreeTerms,
         CustomText1 = @CustomText1, CustomText2 = @CustomText2, CustomText3 = @CustomText3,
         CustomSelect1 = @CustomSelect1, CustomChoices1 = @CustomChoices1,
         CustomSelect2 = @CustomSelect2, CustomChoices2 = @CustomChoices2,
         CustomText_Req = @CustomText_Req, CustomSelect_Req = @CustomSelect_Req,
         EmailUser   = @EmailUser,   EmailAdmin  = @EmailAdmin,
         EmailAffs   = @EmailAffs,   EmailDrop   = @EmailDrop,
         EmailDropWhen = @EmailDropWhen,
         OrderEmail  = @OrderEmail,  DropEmail   = @DropEmail`,
      s
    ),
    query(
      "UPDATE Settings SET GiftRegistry = @GiftRegistry, Wishlists = @Wishlists",
      { GiftRegistry: s.GiftRegistry, Wishlists: s.Wishlists }
    ),
  ]);
}
