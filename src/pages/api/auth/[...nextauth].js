import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: "dnRaQzRicVVFeEhvYkZqWlVVNnU6MTpjaQ",
      clientSecret: "lUS7wq04Zja7BjiX6mBhnWkSoNC80ZxYf9aALc75dtaypitcmj",
      version: "2.0",
    }),
  ],
};
export default NextAuth(authOptions);
