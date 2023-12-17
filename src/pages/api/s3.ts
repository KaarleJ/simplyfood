import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { generateUploadUrl } from '@/s3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authorization
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    const url = await generateUploadUrl();
    res.status(200).json({ url });
    return;
  }
}
