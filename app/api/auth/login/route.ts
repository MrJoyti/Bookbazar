import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { publicUserSelect, setSessionCookie, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("Invalid JSON body.");

  const email = isNonEmptyString(body.email) ? body.email.trim().toLowerCase() : "";
  const password = isNonEmptyString(body.password) ? body.password : "";

  if (!email || !password) return fail("Email and password are required.");

  const userWithPassword = await db.user.findUnique({
    where: { email },
    select: { ...publicUserSelect, passwordHash: true },
  });

  if (!userWithPassword || !(await verifyPassword(password, userWithPassword.passwordHash))) {
    return fail("Invalid email or password.", 401);
  }
  if (userWithPassword.status === "BLOCKED") {
    return fail("This account is blocked.", 403);
  }

  const { passwordHash, ...user } = userWithPassword;
  setSessionCookie(user);

  await db.notification.create({
    data: {
      userId: user.id,
      text: `Logged in successfully as ${user.name}.`,
      type: "success",
    },
  });

  return ok({ user });
}
