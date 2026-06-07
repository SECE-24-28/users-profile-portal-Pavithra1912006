import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@mfi.com" },
    update: {},
    create: {
      email: "admin@mfi.com",
      password: hashed,
      role: "admin",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Sample students
  const students = [
    { name: "Alice Johnson", email: "alice@mfi.com", phone: "+1-555-0101", gender: "Female", course: "Computer Science", address: "123 Main St, New York" },
    { name: "Bob Smith", email: "bob@mfi.com", phone: "+1-555-0102", gender: "Male", course: "Business Admin", address: "456 Oak Ave, Chicago" },
    { name: "Carol White", email: "carol@mfi.com", phone: "+1-555-0103", gender: "Female", course: "Data Science", address: "789 Pine Rd, Los Angeles" },
  ];

  for (const s of students) {
    await prisma.student.upsert({
      where: { email: s.email },
      update: {},
      create: s,
    });
  }

  console.log("✅ Sample students seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
