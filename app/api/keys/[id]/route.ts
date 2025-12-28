import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, apiKeys } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { redis } from "@/lib/redis";

// Helper to get or create user
async function getOrCreateUser(clerkUser: any) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, clerkUser.id))
    .limit(1);

  if (existingUser) {
    return existingUser;
  }

  const [newUser] = await db
    .insert(users)
    .values({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })
    .returning();

  return newUser;
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await getOrCreateUser(user);

  const [key] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.id, params.id), eq(apiKeys.userId, dbUser.id)))
    .limit(1);

  if (!key) return NextResponse.json({ success: true });

  await db.delete(apiKeys).where(eq(apiKeys.id, params.id));

  // 🔥 delete Redis runtime key
  await redis.del(`apikey:*:${params.id}`); // OR track key->id mapping

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await getOrCreateUser(user);
  const body = await request.json();

  const update: any = {};
  if (typeof body.name === 'string') update.name = body.name;
  if (typeof body.isActive === 'boolean') update.isActive = body.isActive;

  await db
    .update(apiKeys)
    .set(update)
    .where(
      and(
        eq(apiKeys.id, params.id),
        eq(apiKeys.userId, dbUser.id)
      )
    );

  return NextResponse.json({ success: true });
}
