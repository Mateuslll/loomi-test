import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const SALT = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync('admin123', SALT);
  await prisma.user.create({
    data: {
      email: 'admin@email.com',
      password: password,
      role: 'ADMIN',
      name: 'admin',
      status: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
