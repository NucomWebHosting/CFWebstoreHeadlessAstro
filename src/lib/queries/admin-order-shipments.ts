import { query } from "../db";

export async function addShipment(
  orderNo: number,
  shipItems: { itemId: number; qty: number; weight: number }[]
): Promise<void> {
  const validItems = shipItems.filter(i => i.qty > 0);
  if (validItems.length === 0) return;

  const result = await query<{ id: number }>(
    `INSERT INTO Shipment (Order_No, DateEntered)
     OUTPUT INSERTED.Shipment_ID AS id
     VALUES (@orderNo, GETDATE())`,
    { orderNo }
  );
  const shipmentId = result[0]?.id;
  if (!shipmentId) throw new Error("Failed to create shipment");

  for (const item of validItems) {
    await query(
      `INSERT INTO Shipment_Items (Shipment_ID, Item_ID, Quantity) VALUES (@shipmentId, @itemId, @qty)`,
      { shipmentId, itemId: item.itemId, qty: item.qty } as Record<string, number>
    );
    await query(
      `UPDATE Order_Items SET Quantity_shipped = ISNULL(Quantity_shipped, 0) + @qty WHERE Item_ID = @itemId`,
      { qty: item.qty, itemId: item.itemId } as Record<string, number>
    );
  }
}

export async function deleteShipment(shipmentId: number): Promise<void> {
  const items = await query<{ Item_ID: number; Quantity: number }>(
    `SELECT Item_ID, Quantity FROM Shipment_Items WHERE Shipment_ID = @shipmentId`,
    { shipmentId }
  );
  for (const item of items) {
    await query(
      `UPDATE Order_Items SET Quantity_shipped = ISNULL(Quantity_shipped, 0) - @qty WHERE Item_ID = @itemId`,
      { qty: item.Quantity, itemId: item.Item_ID } as Record<string, number>
    );
  }
  await query(`DELETE FROM Shipment_Items WHERE Shipment_ID = @shipmentId`, { shipmentId });
  await query(`DELETE FROM Shipment WHERE Shipment_ID = @shipmentId`, { shipmentId });
}

export interface ShipmentRow {
  Shipment_ID: number;
  Order_No: number;
  Shipper: string | null;
  ShipType: string | null;
  Tracking: string | null;
  Actual_Shipping: number | null;
}

export async function getShipmentForTracking(shipmentId: number): Promise<ShipmentRow | null> {
  const rows = await query<ShipmentRow>(
    `SELECT Shipment_ID, Order_No, Shipper, ShipType, Tracking, Actual_Shipping
     FROM Shipment WHERE Shipment_ID = @shipmentId`,
    { shipmentId }
  );
  return rows[0] ?? null;
}

export interface ShipmentTrackingData {
  shipper: string;
  shipType: string;
  tracking: string;
  actualShipping: number | null;
}

export async function updateShipmentTracking(shipmentId: number, d: ShipmentTrackingData): Promise<void> {
  await query(
    `UPDATE Shipment SET Shipper=@shipper, ShipType=@shipType, Tracking=@tracking, Actual_Shipping=@cost
     WHERE Shipment_ID=@shipmentId`,
    { shipmentId, shipper: d.shipper, shipType: d.shipType, tracking: d.tracking, cost: d.actualShipping } as Record<string, string | number | null>
  );
}

export async function markShipmentPrinted(shipmentId: number): Promise<void> {
  await query(`UPDATE Shipment SET Printed_Pack=1 WHERE Shipment_ID=@shipmentId`, { shipmentId });
}

// ── Packing Slip ──────────────────────────────────────────────────────────────

export interface PacklistItem {
  Name: string;
  SKU: string | null;
  UPC: string | null;
  Options: string | null;
  Addons: string | null;
  Quantity: number;
  ProdType: string | null;
}

export interface PacklistData {
  orderId: number;
  friendlyOrderNo: number;
  dateOrdered: Date;
  shipType: string | null;
  comments: string | null;
  shipTo: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    country: string | null;
  };
  items: PacklistItem[];
  store: {
    name: string | null;
    imageBase: string | null;
    logoPrint: string | null;
    logoDesktop: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    phone: string | null;
    email: string | null;
  };
}

export async function getPacklistData(orderId: number, shipmentId: number | null): Promise<PacklistData | null> {
  // Order header
  const orders = await query<{
    Order_No: number; DateOrdered: Date; ShipType: string | null;
    Comments: string | null; ShipTo: number; Customer_ID: number;
  }>(
    `SELECT Order_No, DateOrdered, ShipType, Comments, ShipTo, Customer_ID
     FROM Order_No WHERE Order_No = @orderId`,
    { orderId }
  );
  const order = orders[0];
  if (!order) return null;

  // Ship-to address — use ShipTo customer if set, otherwise billing customer
  const custId = order.ShipTo || order.Customer_ID;
  const [customers, itemRows, storeRows, settingsRows] = await Promise.all([
    query<{
      FirstName: string | null; LastName: string | null; Company: string | null;
      Address1: string | null; Address2: string | null; City: string | null;
      State: string | null; Zip: string | null; Country: string | null;
    }>(
      `SELECT FirstName, LastName, Company, Address1, Address2, City, State, Zip, Country
       FROM Customers WHERE Customer_ID = @custId`,
      { custId }
    ),
    shipmentId
      ? query<PacklistItem>(
          `SELECT OI.Name, OI.SKU, OI.UPC,
             CONVERT(NVARCHAR(4000), OI.Options) AS Options,
             CONVERT(NVARCHAR(4000), OI.Addons) AS Addons,
             SI.Quantity, P.Prod_type AS ProdType
           FROM Order_Items OI
           LEFT JOIN Shipment_Items SI ON OI.Item_ID = SI.Item_ID
           LEFT JOIN Products P ON OI.Product_ID = P.Product_ID
           WHERE OI.Order_No = @orderId AND SI.Shipment_ID = @shipmentId
             AND (OI.PackageParent <> 1 OR OI.PackageParent IS NULL)`,
          { orderId, shipmentId } as Record<string, number>
        )
      : query<PacklistItem>(
          `SELECT OI.Name, OI.SKU, OI.UPC,
             CONVERT(NVARCHAR(4000), OI.Options) AS Options,
             CONVERT(NVARCHAR(4000), OI.Addons) AS Addons,
             OI.Quantity - ISNULL(OI.Dropship_qty, 0) AS Quantity, P.Prod_type AS ProdType
           FROM Order_Items OI
           LEFT JOIN Products P ON OI.Product_ID = P.Product_ID
           WHERE OI.Order_No = @orderId
             AND (OI.PackageParent <> 1 OR OI.PackageParent IS NULL)
             AND (OI.Quantity - ISNULL(OI.Dropship_qty, 0)) > 0`,
          { orderId }
        ),
    query<{
      SiteName: string | null; DefaultImages: string | null;
      Logo_print: string | null; Logo_desktop: string | null;
      Address1: string | null; Address2: string | null;
      City: string | null; State: string | null; Postalcode: string | null;
      Phone: string | null; MerchantEmail: string | null;
    }>(`SELECT TOP 1 SiteName, DefaultImages, Logo_print, Logo_desktop,
          Address1, Address2, City, State, Postalcode, Phone, MerchantEmail
        FROM Settings`),
    query<{ BaseOrderNum: number }>(`SELECT TOP 1 BaseOrderNum FROM OrderSettings`),
  ]);

  const cust  = customers[0];
  const store = storeRows[0];
  const base  = settingsRows[0]?.BaseOrderNum ?? 0;

  return {
    orderId,
    friendlyOrderNo: orderId + base,
    dateOrdered: order.DateOrdered,
    shipType: order.ShipType,
    comments: order.Comments,
    shipTo: {
      firstName: cust?.FirstName ?? null,
      lastName:  cust?.LastName  ?? null,
      company:   cust?.Company   ?? null,
      address1:  cust?.Address1  ?? null,
      address2:  cust?.Address2  ?? null,
      city:      cust?.City      ?? null,
      state:     cust?.State     ?? null,
      zip:       cust?.Zip       ?? null,
      country:   cust?.Country   ?? null,
    },
    items: itemRows,
    store: {
      name:        store?.SiteName       ?? null,
      imageBase:   store?.DefaultImages  ?? "/images",
      logoPrint:   store?.Logo_print     ?? null,
      logoDesktop: store?.Logo_desktop   ?? null,
      address1:    store?.Address1       ?? null,
      address2:    store?.Address2       ?? null,
      city:        store?.City           ?? null,
      state:       store?.State          ?? null,
      postalCode:  store?.Postalcode     ?? null,
      phone:       store?.Phone          ?? null,
      email:       store?.MerchantEmail  ?? null,
    },
  };
}
