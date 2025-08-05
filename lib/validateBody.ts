import { NextApiRequest, NextApiResponse } from 'next';
import { Schema } from 'joi';

export function validateBody(schema: Schema, req: NextApiRequest, res: NextApiResponse): boolean {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    res.status(400).json({ success: false, error: `Validation error: ${errorMessage}` });
    return false;
  }

  req.body = value;
  return true;
}
