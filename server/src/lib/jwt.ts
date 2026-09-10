import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET ?? (() => {
  throw new Error("JWT_SECRET is not set in the environment");
})();

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string" ||
    typeof decoded.email !== "string" ||
    typeof decoded.name !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
    name: decoded.name,
  };
}
