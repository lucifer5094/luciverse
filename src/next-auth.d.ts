// src/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';

// Hum yahan NextAuth ke default types ko extend kar rahe hain

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // Yahan humne bataya ki 'accessToken' aur 'error' Session object mein ho sakte hain
    accessToken?: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    // Yahan humne bataya ki JWT token ke andar yeh properties hongi
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}