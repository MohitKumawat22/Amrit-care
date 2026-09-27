import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import supabase from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID?.trim() &&
  process.env.GOOGLE_CLIENT_SECRET?.trim()
);

const patientSessionFields = `
  id, first_name, last_name, email, username, phone, age, blood, created_at
`;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
 callbacks: {
 async signIn({ user, account, profile }) {
   if (account?.provider !== "google") return true;

   const email = user.email?.trim().toLowerCase();
   const googleProfile = profile as { email_verified?: boolean } | undefined;
   if (!email || googleProfile?.email_verified !== true) {
     return false;
   }

   const { data: existingPatient, error: lookupError } = await supabase
     .from("patients")
     .select(patientSessionFields)
     .eq("email", email)
     .maybeSingle();

   if (lookupError) {
     console.error("Google patient lookup failed:", lookupError);
     return false;
   }

   let patient = existingPatient;
   if (!patient) {
     const fullName = user.name?.trim() || email.split("@")[0];
     const [firstName, ...lastNameParts] = fullName.split(/\s+/);
     const username = `${email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase() || "patient"}-${randomUUID().slice(0, 8)}`;
     const generatedPassword = await bcrypt.hash(randomUUID(), 12);

     const { data: createdPatient, error: insertError } = await supabase
       .from("patients")
       .insert({
         first_name: firstName || "Patient",
         last_name: lastNameParts.join(" ") || "User",
         email,
         username,
         password: generatedPassword,
       })
       .select(patientSessionFields)
       .single();

     if (insertError || !createdPatient) {
       console.error("Google patient provisioning failed:", insertError);
       return false;
     }
     patient = createdPatient;
   }

   (user as any).id = patient.id;
   (user as any).role = "patient";
   (user as any).patient = {
     id: patient.id,
     firstName: patient.first_name,
     lastName: patient.last_name,
     email: patient.email,
     username: patient.username,
     phone: patient.phone,
     age: patient.age,
     blood: patient.blood,
     createdAt: patient.created_at,
   };
   return true;
 },
 async jwt({ token, user }) {
 if (user) {
 token.id = user.id;
 token.role = (user as any).role;
 token.patient = (user as any).patient;
 }
 return token;
 },
 async session({ session, token }) {
 if (session.user) {
 (session.user as any).id = token.id;
 (session.user as any).role = token.role;
 (session.user as any).patient = token.patient;
 }
 return session;
 },
 },
 session: {
 strategy:"jwt",
 },
  secret: process.env.NEXTAUTH_SECRET || "amritcare-nextauth-dev-secret-key-32chars-min!",
  pages: {
    signIn: "/doctor/login",
  },
};
