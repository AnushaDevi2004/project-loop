import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/validations/auth.validation";
import { generateToken } from "@/lib/jwt";
import { LoginInput } from "@/validations/auth.validation";

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

// Login User
export async function loginUser(data: LoginInput) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT Token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}