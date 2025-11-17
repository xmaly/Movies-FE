import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch("http://localhost:5013/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();

          return {
            id: user.email,
            email: user.email,
            name: user.email,
            token: user.token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
    // Add Google provider when env vars are present
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
              params: { scope: "openid email profile" },
            },
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "default-secret-change-in-production",
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        // If signing in via credentials the user object may already include token
        if ((user as any).token) token.accessToken = (user as any).token;
      }

      // If this is a Google sign-in, exchange Google tokens with backend
      if (account && account.provider === "google") {
        try {
          const googlePayload = {
            email: token.email,
            googleId: account.providerAccountId,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresIn: account.expires_at ? account.expires_at : undefined,
          } as any;

          const resp = await fetch(
            (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013") + "/api/Auth/google",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(googlePayload),
            }
          );

          if (resp.ok) {
            const data = await resp.json();
            if (data?.token) {
              token.accessToken = data.token;
            }
          }
        } catch (e) {
          // ignore backend errors here; user can still have session from Google
          console.error("Google backend exchange failed:", e);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        (session.user as any).id = token.sub;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
