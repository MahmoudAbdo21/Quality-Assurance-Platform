import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function getVisitorId() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get('visitor_id')?.value;

  if (!visitorId) {
    // Fallback if middleware didn't set it (shouldn't happen on normal pages)
    // We just return a temporary one or create a new one in DB and return it.
    // We cannot set the cookie here because it's a Server Component context.
    const visitor = await prisma.visitor.create({ data: {} });
    return visitor.id;
  } 

  // Verify it exists in DB
  const exists = await prisma.visitor.findUnique({ where: { id: visitorId } });
  if (!exists) {
    await prisma.visitor.create({ data: { id: visitorId } });
  }

  return visitorId;
}
