import { query } from "../db";

export async function voidPayment(paymentId: number): Promise<void> {
  await query(`UPDATE Payment SET Voided=1, Status='CANCELED' WHERE Payment_ID=@paymentId`, { paymentId });
}

export interface ManualPaymentData {
  amount: number;
  offlinePayment: string; // Cash | Check | Purchase Order | Offline | Other
  authNumber: string;
}

export async function addManualPayment(orderNo: number, d: ManualPaymentData): Promise<void> {
  await query(
    `INSERT INTO Payment (Order_No, PaymentDateTime, Amount, OfflinePayment, AuthNumber, Voided)
     VALUES (@orderNo, GETDATE(), @amount, @offlinePayment, @authNumber, 0)`,
    { orderNo, amount: d.amount, offlinePayment: d.offlinePayment || "Offline", authNumber: d.authNumber || "" } as Record<string, string | number>
  );
  await query(
    `UPDATE Order_No SET Paid = CASE WHEN OrderTotal <= (SELECT ISNULL(SUM(Amount),0) FROM Payment WHERE Order_No=@orderNo AND Voided=0) THEN 1 ELSE Paid END WHERE Order_No=@orderNo`,
    { orderNo }
  );
}
