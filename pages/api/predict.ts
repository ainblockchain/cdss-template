// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  hpa?: number;
  error?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { age, height } = req.body;
    if (age === 0) {
      throw new Error('Divided by zero');
    }
    res.status(200).json({ hpa: height / age });
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
