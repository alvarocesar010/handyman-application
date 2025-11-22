// lib/auth.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);

const alg = "HS256";

export async function signAdminJwt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("24h") // session duration
    .sign(secret);
}

export async function verifyAdminJwt(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: [alg],
  });
  return payload;
}
