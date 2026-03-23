export const prerender = false;
import { query } from "../../lib/db";
import { getSettings } from "../../lib/queries/settings";
import { createTransporter } from "../../lib/email";

export async function POST({ request }: { request: Request }) {
  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { name = "", email = "", phone = "", message = "" } = body;

  if (!name.trim() || !email.trim() || !message.trim()) {
    return new Response(JSON.stringify({ error: "Name, email, and message are required." }), { status: 400 });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return new Response(JSON.stringify({ error: "Please enter a valid email address." }), { status: 400 });
  }

  const settings = await getSettings();
  const toEmail = settings?.MerchantEmail ?? settings?.Email ?? "";

  // Split name into first/last on first space
  const spaceIdx = name.trim().indexOf(" ");
  const firstName = spaceIdx === -1 ? name.trim() : name.trim().slice(0, spaceIdx);
  const lastName  = spaceIdx === -1 ? "" : name.trim().slice(spaceIdx + 1);

  await query(
    `INSERT INTO ContactForms
       (SettingID, Form_name, Form_URL, ToEmail, FromEmail, Subject, Message, FirstName, LastName, Phone, Status, ReadStatus, DateCreated, DateLastUpdated)
     VALUES
       (1, 'contact-us', '/Contact-Us/', @toEmail, @fromEmail, 'Contact Us Form Submission', @message, @firstName, @lastName, @phone, 'New', 0, GETDATE(), GETDATE())`,
    { toEmail, fromEmail: email, message: message.trim(), firstName, lastName, phone: phone.trim() }
  );

  // Send email notification — failure is non-fatal (submission already saved to DB)
  const transporter = createTransporter(settings);
  if (transporter && toEmail) {
    const phoneLine = phone.trim() ? `\nPhone: ${phone.trim()}` : "";
    try {
      await transporter.sendMail({
        from: settings?.Email_User ?? toEmail,
        to: toEmail,
        replyTo: email,
        subject: `Contact Us: ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email}${phoneLine}\n\n${message.trim()}`,
      });
    } catch (err) {
      console.error("[contact] Email send failed:", err);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
