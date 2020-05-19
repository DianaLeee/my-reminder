import crypto from "crypto";
import { config } from "../../config";
import { Repository, getManager, getConnection } from "typeorm";
import { User } from "../../entity/User";
import jwt from "jsonwebtoken";

const hash = (password: string) => {
  return crypto.createHmac("sha256", config.hashSecretKey).update(password).digest("hex");
};

const isEmailExist = async (email: string) => {
  const userRepository: Repository<User> = getConnection().getRepository(User);
  const user: User = await userRepository.findOne({ email: email });

  if (user) {
    return true;
  } else {
    return false;
  }
};

const getUser = async (email: string, password: string) => {
  const userRepository: Repository<User> = getConnection().getRepository(User);
  const user: User = await userRepository.findOne({
    email: email,
    password: hash(password),
  });

  if (user) {
    return user;
  } else {
    return false;
  }
};

const createNewUser = async (email: string, password: string, name: string) => {
  const userRepository: Repository<User> = getConnection().getRepository(User);

  // Initialize user
  const userToBeSaved = new User();
  await userToBeSaved.setUser(email, hash(password), name);

  try {
    // Email Varification
    if (await isEmailExist(email)) {
      return {
        status: 409,
        message: `Conflic Error: ${email} is already exist`,
      };
    } else {
      await userRepository.save(userToBeSaved);
      return {
        status: 200,
        body: userToBeSaved,
      };
    }
  } catch (e) {
    console.log(e);
  }
};

const generateToken = async (id: number, email: string) => {
  const token = jwt.sign(
    {
      uid: id,
      email: email,
    },
    config.jwtSecretKey,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

module.exports = {
  getUser,
  createNewUser,
  isEmailExist,
  generateToken,
};
