import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface IServerConfig {
  port: number;
  hashSecretKey: string;
  jwtSecretKey: string;
}

const config: IServerConfig = {
  port: +process.env.PORT || 4000,
  hashSecretKey: process.env.SECRET_KEY,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};

export { config };
