import { withAuth } from "next-auth/middleware";

const authSecret = process.env.NEXTAUTH_SECRET ?? "development-only-magic-the-galo-secret";

export default withAuth({
  secret: authSecret,
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized({ token, req }) {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      return Boolean(token);
    }
  }
});

export const config = {
  matcher: ["/admin/:path*"]
};
