import { AuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token: any) {
  try {
    console.log("--- Attempting to refresh token ---");
    console.log(
      "Client ID Loaded:",
      process.env.SPOTIFY_CLIENT_ID ? "Yes" : "NO!!!"
    );
    console.log("Refresh Token Present:", token.refreshToken ? "Yes" : "NO!!!");

    if (!token.refreshToken) {
      throw new Error("Refresh token is missing.");
    }

    const url = "https://accounts.spotify.com/api/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      console.error("--- SPOTIFY REFRESH TOKEN ERROR ---");
      console.error("Status:", response.status);
      console.error("Response Body:", responseBody); // Yahan humein actual error dikhega
      console.error("---------------------------------");
      throw new Error("Refresh token request failed.");
    }

    const refreshedTokens = JSON.parse(responseBody);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("--- CRASH in refreshAccessToken ---", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
// ... baaki ka code (authOptions, etc.) waise hi rahega
export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "user-read-email user-read-currently-playing user-top-read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : 0;
        return token;
      }
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      console.log("Access token expired, refreshing...");
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};
