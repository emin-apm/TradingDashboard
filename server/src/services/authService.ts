import { User, IUser } from "../models/userModal";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = "1h";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refreshsecret";

type AuthInput = {
  email: string;
  password: string;
};

type Coin = {
  symbol: string;
  amount: number;
};

type Trade = {
  symbol: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  date: Date;
};

type AuthResult = {
  userData: {
    email: string;
    id: string;
    myCoins: Coin[];
    tradeHistory: Trade[];
  };
  refreshToken: string;
  accessToken: string;
};

export async function register({
  email,
  password,
}: AuthInput): Promise<AuthResult> {
  email = email.toLowerCase();

  if (await User.findOne({ email })) throw new Error("User already exists!");

  const user: IUser = await User.create({
    email,
    password,
    myCoins: [
      { symbol: "BTC", amount: 5 },
      { symbol: "ETH", amount: 5 },
    ],
    tradeHistory: [
      {
        symbol: "BTC",
        side: "buy",
        price: 30000,
        amount: 1,
        date: new Date(),
      },
      {
        symbol: "ETH",
        side: "sell",
        price: 2000,
        amount: 2,
        date: new Date(),
      },
    ],
  });

  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    userData: {
      email: user.email,
      id: user._id.toString(),
      myCoins: user.myCoins,
      tradeHistory: user.tradeHistory,
    },
    refreshToken,
    accessToken,
  };
}

export async function login({
  email,
  password,
}: AuthInput): Promise<AuthResult> {
  email = email.toLowerCase();

  const user: IUser | null = await User.findOne({ email });
  if (!user || !(await user.comparePassword!(password)))
    throw new Error("Invalid email or password.");

  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    userData: {
      email: user.email,
      id: user._id.toString(),
      myCoins: user.myCoins,
      tradeHistory: user.tradeHistory,
    },
    refreshToken,
    accessToken,
  };
}

export async function refreshToken(token: string): Promise<AuthResult> {
  try {
    const payload: any = jwt.verify(token, REFRESH_SECRET);
    const user: IUser | null = await User.findById(payload.id);
    if (!user) throw new Error("User not found");

    const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });
    const newAccessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      userData: {
        email: user.email,
        id: user._id.toString(),
        myCoins: user.myCoins,
        tradeHistory: user.tradeHistory,
      },
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
    };
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
}
