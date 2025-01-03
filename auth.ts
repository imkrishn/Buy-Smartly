import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { connect } from "./dbConfig/dbConfig";
import User from "./models/userModel";
import bcryptjs from "bcryptjs";

// Export NextAuth handler
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Ensure you're connected to the database
      await connect();

      // Check if user exists in database
      if (user) {
        const existingUser = await User.findOne({ email: user.email });

        // If user does not exist, create a new user
        if (!existingUser && account && profile) {
          const password = "369 Verified by auth"; // Default password (should be improved in production)

          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(password, salt);

          // Create a new user in the database
          await User.create({
            fullName: user.name,
            email: user.email,
            dateOfBirth: "2004-09-07T00:00:00.000+00:00",
            password: hashedPassword,
            salt: salt,
            isVerified: true
          });
        }

        // Attach additional information to the token
        if (account) {
          token.provider = account.provider;
        }
      }

      return token;
    },

    async session({ session }) {

      /* if (token) {
        session.user.provider = token.provider; 
      } */
      return session;
    },
  },
});

