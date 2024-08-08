// import { z } from 'zod';

// const envSchema = z.object({
//   DATABASE_URL: z.string().url().startsWith('postgresql:'),
//   GOOGLE_CLIENT_ID: z.string().min(1),
//   GOOGLE_CLIENT_SECRET: z.string().min(1),
//   NEXTAUTH_URL: z.string().min(1),
//   NEXTAUTH_SECRET: z.string().min(1),
// });

// export const env = envSchema.parse(process.env);


import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string({
    required_error: "DATABASE_URL is required",
  }).url().startsWith('postgresql:'),
  GOOGLE_CLIENT_ID: z.string({
    required_error: "GOOGLE_CLIENT_ID is required",
  }).min(1),
  GOOGLE_CLIENT_SECRET: z.string({
    required_error: "GOOGLE_CLIENT_SECRET is required",
  }).min(1),
  NEXTAUTH_URL: z.string({
    required_error: "NEXTAUTH_URL is required",
  }).min(1),
  NEXTAUTH_SECRET: z.string({
    required_error: "NEXTAUTH_SECRET is required",
  }).min(1),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    //@ts-ignore
    console.error("Environment variable validation failed:", error.errors);
    throw error;
  }
}

export const env = validateEnv();