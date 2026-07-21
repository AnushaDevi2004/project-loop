import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/validations/auth.validation";

export async function registerUser(data: RegisterInput) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Save user
 const user = await prisma.user.create({
  data: {
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  },
});

  return user;
}