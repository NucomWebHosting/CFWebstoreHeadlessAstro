import nodemailer from "nodemailer";
import type { SettingsRow } from "./types";

export function createTransporter(settings: SettingsRow | null) {
  if (!settings?.Email_Server || !settings?.Email_User || !settings?.Email_Pass) return null;
  return nodemailer.createTransport({
    host: settings.Email_Server,
    port: settings.Email_Port ?? 587,
    secure: settings.Email_useSSL ?? false,
    requireTLS: settings.Email_useTLS ?? false,
    auth: { user: settings.Email_User, pass: settings.Email_Pass },
  });
}
