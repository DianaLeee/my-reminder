import jwt from "jsonwebtoken";
import { config } from "../config";

function decodeToken(token: any) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecretKey, (error: any, decoded: any) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
}

exports.jwtMiddleware = async (ctx: any, next: any) => {
  const token = ctx.cookies.get("access_token");
  if (!token) return next(); //토큰 없으면 다음 작업 진행

  try {
    const decoded = await decodeToken(token);
    ctx.request.user = decoded;
  } catch (e) {
    ctx.request.user = null;
  }
  return next();
};
