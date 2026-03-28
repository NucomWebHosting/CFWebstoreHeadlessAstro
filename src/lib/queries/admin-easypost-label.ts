import { query } from "../db";

export interface LabelOrderData {
  orderId: number;
  shipmentId: number;
  weightOz: number | null;
  // Ship-to address
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
}

export async function getOrderForLabel(
  orderId: number,
  shipmentId: number
): Promise<LabelOrderData | null> {
  const orders = await query<{
    Order_No: number;
    Customer_ID: number;
    ShipTo: number | null;
  }>(
    `SELECT Order_No, Customer_ID, ShipTo FROM Order_No WHERE Order_No = @orderId`,
    { orderId }
  );
  const order = orders[0];
  if (!order) return null;

  const shipments = await query<{ Weight: number | null }>(
    `SELECT Weight FROM Shipment WHERE Shipment_ID = @shipmentId`,
    { shipmentId }
  );
  const shipment = shipments[0];

  const custId = order.ShipTo || order.Customer_ID;
  const customers = await query<{
    FirstName: string | null;
    LastName: string | null;
    Company: string | null;
    Address1: string | null;
    Address2: string | null;
    City: string | null;
    State: string | null;
    Zip: string | null;
    Country: string | null;
    Phone: string | null;
    Email: string | null;
  }>(
    `SELECT FirstName, LastName, Company, Address1, Address2, City, State, Zip, Country, Phone, Email
     FROM Customers WHERE Customer_ID = @custId`,
    { custId }
  );
  const cust = customers[0];

  return {
    orderId,
    shipmentId,
    weightOz: shipment?.Weight ?? null,
    firstName: cust?.FirstName ?? null,
    lastName:  cust?.LastName  ?? null,
    company:   cust?.Company   ?? null,
    address1:  cust?.Address1  ?? null,
    address2:  cust?.Address2  ?? null,
    city:      cust?.City      ?? null,
    state:     cust?.State     ?? null,
    zip:       cust?.Zip       ?? null,
    country:   cust?.Country   ?? null,
    phone:     cust?.Phone     ?? null,
    email:     cust?.Email     ?? null,
  };
}

export async function saveShipmentLabel(
  shipmentId: number,
  data: {
    ShippingLabel: string;
    easypostshipmentid: string;
    Shipper: string;
    ShipType: string;
    Tracking: string;
    Actual_Shipping: number;
    Weight: number;
  }
): Promise<void> {
  await query(
    `UPDATE Shipment SET
       ShippingLabel      = @ShippingLabel,
       easypostshipmentid = @easypostshipmentid,
       Shipper            = @Shipper,
       ShipType           = @ShipType,
       Tracking           = @Tracking,
       Actual_Shipping    = @Actual_Shipping,
       Weight             = @Weight
     WHERE Shipment_ID = @shipmentId`,
    { shipmentId, ...data } as Record<string, string | number>
  );
}

export async function clearShipmentLabel(shipmentId: number): Promise<void> {
  await query(
    `UPDATE Shipment SET
       ShippingLabel      = '',
       easypostshipmentid = '',
       Tracking           = NULL,
       Shipper            = NULL,
       ShipType           = NULL,
       Actual_Shipping    = NULL
     WHERE Shipment_ID = @shipmentId`,
    { shipmentId }
  );
}
