import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@wasteng.com';
  const password = 'Admin@123'; // change later
  const hashedPassword = await bcrypt.hash(password, 10);

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    console.log('Admin already exists');
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'admin',
    },
  });

  console.log('✅ Admin created successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
