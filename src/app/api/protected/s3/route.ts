import { NextResponse } from 'next/server';
import { generateUploadUrl } from '@/lib/s3';

export async function GET() {
  const url = await generateUploadUrl();
  return NextResponse.json({ url }, { status: 200 });
}
