import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signUpSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";

/**
 * This route will be called to register a new user
 * with their credentials (e-mail and password)
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    // parse and verify data again with zod
    const parseBody = signUpSchema.safeParse(body);

    if (!parseBody.success) {
      return new NextResponse("Invalid information", { status: 400 });
    } else {
      const { email, password, name } = parseBody.data;
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          hashedPassword,
        },
      });

      return NextResponse.json(user);
    }
  } catch (e) {
    console.log("Register error:", e);
    return new NextResponse("Internal error occurred", { status: 500 });
  }
}
