// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Data = {
  result?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { age, height } = req.body;
    const result = await axios.post(
      `${process.env.HE_SERVER_URL}/he/add`,
      { operand1: age, operand2: height },
    );
    res.status(200).json({ result: result.data.result });
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
