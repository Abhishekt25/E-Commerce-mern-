
import dotenv from 'dotenv';
import path from 'path';
import { Request, Response } from 'express';

dotenv.config();

export const text = (req: Request, res: Response) => {
    res.json({ message: 'Hello from the test route!' });
  };

