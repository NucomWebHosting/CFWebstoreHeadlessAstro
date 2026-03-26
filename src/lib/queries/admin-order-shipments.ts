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
