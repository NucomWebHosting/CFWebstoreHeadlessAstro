/// <reference types="astro/client" />

declare namespace App {
  interface SessionData {
    user: {
      id: number;
      username: string;
      permissions: string;
    };
  }
}
