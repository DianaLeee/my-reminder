import Koa, { BaseContext } from "koa";
import { Repository, getManager, getConnection } from "typeorm";
import { User } from "../../entity/User";

const authService = require("./auth.service");

const login = async (ctx: Koa.Context) => {
  const { email, password } = ctx.request.body;
  const user = await authService.getUser(email, password);
  // 로그인 정보 일치하지 않음
  if (user === false) {
    ctx.status = 403;
    return;
  }

  // JWT 토큰 발급
  let token = null;
  try {
    token = await authService.generateToken(user.id, email);
  } catch (e) {
    ctx.throw(500, e);
  }

  // 쿠키 설정
  ctx.cookies.set("access_token", token, { maxAge: 1000 * 60 * 60, httpOnly: true });
  ctx.body = {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};

const logout = (ctx: Koa.Context) => {
  // 쿠키 설정 삭제
  ctx.cookies.set("access_token", null, {
    maxAge: 0,
    httpOnly: true,
  });
  ctx.status = 204;
};

const register = async (ctx: Koa.Context) => {
  const { email, password, name } = ctx.request.body;

  const result = await authService.createNewUser(email, password, name);

  if (result.status === 409) {
    ctx.body = result.message;
    ctx.status = result.status;
  } else {
    ctx.body = result.body;
  }
};

const exist = async (ctx: Koa.Context) => {
  const { email } = ctx.params;

  const user = await authService.isEmailExist(email);

  if (user) {
    ctx.body = `Conflic Error: ${email} is already exist`;
    ctx.status = 409;
  } else {
    ctx.body = email;
    ctx.status = 200;
  }
};

const check = (ctx: any) => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403;
    return;
  }
  ctx.body = user;
};

module.exports = {
  login,
  logout,
  register,
  exist,
  check,
};
