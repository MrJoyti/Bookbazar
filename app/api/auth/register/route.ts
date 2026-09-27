import { Prisma } from "@prisma/client";
import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { db } from "@/lib/db";
import { hashPassword, publicUserSelect, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("Invalid JSON body.");

  const name = isNonEmptyString(body.name) ? body.name.trim() : "";
  const email = isNonEmptyString(body.email) ? body.email.trim().toLowerCase() : "";
  const password = isNonEmptyString(body.password) ? body.password : "";
  const university = isNonEmptyString(body.university) ? body.university.trim() : "";

  if (!name || !email || !password || !university) {
    return fail("Name, email, password, and university are required.");
  }
  if (password.length < 6) {
    return fail("Password must be at least 6 characters.");
  }

  try {
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        university,
        role: "STUDENT",
        balance: 1500,
        notifications: {
          create: {
            text: `Welcome ${name}! Your BookBazar account is active.`,
            type: "success",
          },
        },
      },
      select: publicUserSelect,
    });

    setSessionCookie(user);
    return ok({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("An account with this email already exists.", 409);
    }
    return fail("Could not create account.", 500);
  }
}
