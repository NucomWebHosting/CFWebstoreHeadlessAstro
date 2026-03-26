import { query } from "../db";

// ─── Pricing Tab ──────────────────────────────────────────────────────────────

export interface PricingFields {
  Product_ID: number;
  NotSold: boolean;
  stock_date: Date | null;
  Sale_Start: Date | null;
  Sale_End: Date | null;
  SKU: string | null;
  UPC: string | null;
  ALU: string | null;
  Availability: string | null;
  NumInStock: number | null;
  Min_Order: number | null;
  Mult_Min: boolean;
  Prep_days: number | null;
  reorder_level: number | null;
  Base_Price: number;
  Retail_Price: number | null;
  MAP_Price: number | null;
  Wholesale: number | null;
  Unit_Desc: string | null;
  ShowPrice: string | null;
  showPriceRange: string | null;
  showquantity: number | null;
  subscription: boolean;
  subscription_discount: number | null;
  showDiscounts: boolean;
  ShowPromotions: boolean;
  Vendor_SKU: string | null;
  dropship_cost: number | null;
  DropShip_Note: string | null;
  shipping: boolean;
  shipping_quote: boolean;
  Weight: number | null;
  Item_Handling: number | null;
  freight_dom: number | null;
  freight_intl: number | null;
  Add_Additional_Handling: boolean;
  Giftwrap: boolean;
  Pack_Length: number | null;
  Pack_Width: number | null;
  Pack_Height: number | null;
  Weight2: number | null;
  Pack_Length2: number | null;
  Pack_Width2: number | null;
  Pack_Height2: number | null;
  Weight3: number | null;
  Pack_Length3: number | null;
  Pack_Width3: number | null;
  Pack_Height3: number | null;
  Weight4: number | null;
  Pack_Length4: number | null;
  Pack_Width4: number | null;
  Pack_Height4: number | null;
}

export async function getPricingFields(id: number): Promise<PricingFields | null> {
  const rows = await query<PricingFields>(
    `SELECT Product_ID,
            NotSold, stock_date, Sale_Start, Sale_End,
            SKU, UPC, ALU, Availability, NumInStock,
            Min_Order, Mult_Min, Prep_days, reorder_level,
            Base_Price, Retail_Price, MAP_Price, Wholesale, Unit_Desc,
            ShowPrice, showPriceRange, showquantity,
            subscription, subscription_discount, showDiscounts, ShowPromotions,
            Vendor_SKU, dropship_cost, DropShip_Note,
            shipping, shipping_quote, Weight, Item_Handling, freight_dom, freight_intl,
            Add_Additional_Handling, Giftwrap,
            Pack_Length, Pack_Width, Pack_Height,
            Weight2, Pack_Length2, Pack_Width2, Pack_Height2,
            Weight3, Pack_Length3, Pack_Width3, Pack_Height3,
            Weight4, Pack_Length4, Pack_Width4, Pack_Height4
     FROM   Products WHERE Product_ID = @id`,
    { id }
  );
  return rows[0] ?? null;
}

export async function updatePricingFields(id: number, data: FormData): Promise<void> {
  const s = (k: string) => (data.get(k) as string | null)?.trim() || null;
  const nopt = (k: string) => { const v = s(k); return v ? (parseFloat(v) || null) : null; };
  const iopt = (k: string) => { const v = s(k); return v ? (parseInt(v) || null) : null; };
  const bit  = (k: string) => data.get(k) === "1" ? 1 : 0;
  await query(
    `UPDATE Products SET
       NotSold       = @not_sold,
       stock_date    = @stock_date,
       Sale_Start    = @sale_start,
       Sale_End      = @sale_end,
       SKU           = @sku,
       UPC           = @upc,
       ALU           = @alu,
       Availability  = @availability,
       NumInStock    = @num_in_stock,
       Min_Order     = @min_order,
       Mult_Min      = @mult_min,
       Prep_days     = @prep_days,
       reorder_level = @reorder,
       Base_Price    = @base_price,
       Retail_Price  = @retail_price,
       MAP_Price     = @map_price,
       Wholesale     = @wholesale,
       Unit_Desc     = @unit_desc,
       ShowPrice     = @show_price,
       showPriceRange = @show_price_range,
       showquantity  = @show_quantity,
       subscription  = @subscription,
       subscription_discount = @sub_discount,
       showDiscounts = @show_discounts,
       ShowPromotions = @show_promotions,
       Vendor_SKU    = @vendor_sku,
       dropship_cost = @dropship_cost,
       DropShip_Note = @dropship_note,
       shipping      = @shipping,
       shipping_quote = @shipping_quote,
       Weight        = @weight,
       Item_Handling = @item_handling,
       freight_dom   = @freight_dom,
       freight_intl  = @freight_intl,
       Add_Additional_Handling = @add_handling,
       Giftwrap      = @giftwrap,
       Pack_Length   = @pack_length,
       Pack_Width    = @pack_width,
       Pack_Height   = @pack_height,
       Weight2       = @weight2,
       Pack_Length2  = @pack_length2,
       Pack_Width2   = @pack_width2,
       Pack_Height2  = @pack_height2,
       Weight3       = @weight3,
       Pack_Length3  = @pack_length3,
       Pack_Width3   = @pack_width3,
       Pack_Height3  = @pack_height3,
       Weight4       = @weight4,
       Pack_Length4  = @pack_length4,
       Pack_Width4   = @pack_width4,
       Pack_Height4  = @pack_height4
     WHERE Product_ID = @id`,
    {
      id,
      not_sold:         bit("NotSold"),
      stock_date:       s("stock_date"),
      sale_start:       s("sale_start"),
      sale_end:         s("sale_end"),
      sku:              s("SKU"),
      upc:              s("UPC"),
      alu:              s("ALU"),
      availability:     s("availability"),
      num_in_stock:     iopt("NumInStock"),
      min_order:        iopt("min_order"),
      mult_min:         bit("mult_min"),
      prep_days:        iopt("prep_days"),
      reorder:          iopt("reorder_level"),
      base_price:       parseFloat(s("Base_Price") ?? "0") || 0,
      retail_price:     nopt("Retail_Price"),
      map_price:        nopt("MAP_Price"),
      wholesale:        nopt("Wholesale"),
      unit_desc:        s("Unit_Desc"),
      show_price:       data.get("ShowPrice") === "N" ? "N" : "Y",
      show_price_range: data.get("showPriceRange") === "Y" ? "Y" : "N",
      show_quantity:    iopt("showquantity") ?? 0,
      subscription:     bit("subscription"),
      sub_discount:     nopt("subscription_discount"),
      show_discounts:   bit("showDiscounts"),
      show_promotions:  bit("ShowPromotions"),
      vendor_sku:       s("Vendor_SKU"),
      dropship_cost:    nopt("dropship_cost"),
      dropship_note:    s("DropShip_Note"),
      shipping:         bit("shipping"),
      shipping_quote:   bit("shipping_quote"),
      weight:           nopt("Weight"),
      item_handling:    nopt("Item_Handling"),
      freight_dom:      nopt("freight_dom"),
      freight_intl:     nopt("freight_intl"),
      add_handling:     bit("Add_Additional_Handling"),
      giftwrap:         bit("Giftwrap"),
      pack_length:      nopt("Pack_Length"),
      pack_width:       nopt("Pack_Width"),
      pack_height:      nopt("Pack_Height"),
      weight2:          nopt("Weight2"),
      pack_length2:     nopt("Pack_Length2"),
      pack_width2:      nopt("Pack_Width2"),
      pack_height2:     nopt("Pack_Height2"),
      weight3:          nopt("Weight3"),
      pack_length3:     nopt("Pack_Length3"),
      pack_width3:      nopt("Pack_Width3"),
      pack_height3:     nopt("Pack_Height3"),
      weight4:          nopt("Weight4"),
      pack_length4:     nopt("Pack_Length4"),
      pack_width4:      nopt("Pack_Width4"),
      pack_height4:     nopt("Pack_Height4"),
    } as Record<string, string | number | null>
  );
}

// ─── Group Prices ─────────────────────────────────────────────────────────────

export interface GroupPrice {
  GrpPrice_ID: number;
  Group_ID: number;
  GroupName: string;
  Price: number;
}

export async function getGroupPrices(productId: number): Promise<GroupPrice[]> {
  return query<GroupPrice>(
    `SELECT gp.GrpPrice_ID, gp.Group_ID, g.Name AS GroupName, gp.Price
     FROM   ProdGrpPrice gp
     JOIN   Groups g ON g.Group_ID = gp.Group_ID
     WHERE  gp.Product_ID = @productId
     ORDER  BY g.Name`,
    { productId }
  );
}

export async function getAvailableGroups(productId: number): Promise<{ Group_ID: number; Name: string }[]> {
  return query<{ Group_ID: number; Name: string }>(
    `SELECT g.Group_ID, g.Name
     FROM   Groups g
     WHERE  g.Group_ID NOT IN (SELECT Group_ID FROM ProdGrpPrice WHERE Product_ID = @productId)
     ORDER  BY g.Name`,
    { productId }
  );
}

export async function addGroupPrice(productId: number, groupId: number, price: number): Promise<void> {
  await query(
    `INSERT INTO ProdGrpPrice (Product_ID, Group_ID, Price) VALUES (@productId, @groupId, @price)`,
    { productId, groupId, price }
  );
}

export async function updateGroupPrice(grpPriceId: number, price: number): Promise<void> {
  await query(`UPDATE ProdGrpPrice SET Price=@price WHERE GrpPrice_ID=@grpPriceId`, { grpPriceId, price });
}

export async function deleteGroupPrice(grpPriceId: number): Promise<void> {
  await query(`DELETE FROM ProdGrpPrice WHERE GrpPrice_ID = @grpPriceId`, { grpPriceId });
}

// ─── Qty Discounts ────────────────────────────────────────────────────────────

export interface QtyDiscount {
  ProdDisc_ID: number;
  Wholesale: boolean;
  QuantFrom: number;
  QuantTo: number;
  DiscountPer: number;
  Display: boolean;
  Type: boolean;
}

export async function getQtyDiscounts(productId: number): Promise<QtyDiscount[]> {
  return query<QtyDiscount>(
    `SELECT ProdDisc_ID, Wholesale, QuantFrom, QuantTo, DiscountPer, Display, Type
     FROM   ProdDisc WHERE Product_ID = @productId
     ORDER  BY Wholesale ASC, QuantFrom ASC`,
    { productId }
  );
}

export async function addQtyDiscount(productId: number, data: {
  wholesale: boolean; quantFrom: number; quantTo: number;
  discountPer: number; display: boolean; type: boolean;
}): Promise<void> {
  await query(
    `INSERT INTO ProdDisc (Product_ID, Wholesale, QuantFrom, QuantTo, DiscountPer, Display, Type)
     VALUES (@productId, @wholesale, @quantFrom, @quantTo, @discountPer, @display, @type)`,
    {
      productId,
      wholesale:   data.wholesale ? 1 : 0,
      quantFrom:   data.quantFrom,
      quantTo:     data.quantTo,
      discountPer: data.discountPer,
      display:     data.display ? 1 : 0,
      type:        data.type ? 1 : 0,
    }
  );
}

export async function deleteQtyDiscount(discId: number): Promise<void> {
  await query(`DELETE FROM ProdDisc WHERE ProdDisc_ID = @discId`, { discId });
}
