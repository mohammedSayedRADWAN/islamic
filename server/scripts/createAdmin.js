import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db.js';
import User from '../models/User.js';

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: npm run admin:create -- "Instructor name" email password');
  process.exit(1);
}

try {
  await connectDatabase();
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { name, email: email.toLowerCase(), passwordHash, role: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Admin ready: ${admin.email}`);
  await User.db.close();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
