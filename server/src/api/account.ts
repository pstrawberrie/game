import { Router, Request, Response } from 'express';
import { Account, AccountCreateRequest, AccountCreateResponse } from '../../../shared/src/types/account';
import { randomUUID } from 'crypto';
import db from '../database/sqlite';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { username, password } = req.body as AccountCreateRequest;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required.' });
  }
  const existing = db.prepare('SELECT * FROM accounts WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ success: false, message: 'Username already exists.' });
  }
  const account: Account = { id: randomUUID(), username };
  db.prepare('INSERT INTO accounts (id, username, password) VALUES (?, ?, ?)').run(account.id, account.username, password);
  const response: AccountCreateResponse = { success: true, account };
  res.json(response);
});

export default router; 