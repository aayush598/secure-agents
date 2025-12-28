import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/utils/crypto";
import { users } from "@/lib/db/schema";

// helper (same as your other routes)
async function getOrCreateUser(clerkUser: any) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, clerkUser.id))
    .limit(1);

  if (user) return user;

  const [created] = await db
    .insert(users)
    .values({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })
    .returning();

  return created;
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await getOrCreateUser(clerkUser);

  const [key] = await db
    .select({
      keyEncrypted: apiKeys.keyEncrypted,
    })
    .from(apiKeys)
    .where(
      and(
        eq(apiKeys.id, params.id),
        eq(apiKeys.userId, dbUser.id)
      )
    )
    .limit(1);

  if (!key) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    key: decrypt(key.keyEncrypted),
  });
}
