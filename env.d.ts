/* eslint-disable @typescript-eslint/no-unused-vars */

namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    UPLOADTHING_SECRET: string;
    UPLOADTHING_APP_ID: string;
    NEXT_PUBLIC_PUSHER_KEY: string;
    PUSHER_ID: string;
    PUSHER_SECRET: string;
    NEXT_PUBLIC_PUSHER_CLUSTER: string;
  }
}
