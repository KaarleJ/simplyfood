import { NextResponse } from 'next/server';
import { generateUploadUrl } from '@/s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/next.config';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const url = await generateUploadUrl();
  return NextResponse.json({ url }, { status: 200 });
}
