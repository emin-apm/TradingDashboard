import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

const SALT_HASH = 10;

type Coin = {
  symbol: string;
  amount: number;
  buyPrice: number;
};

type Trade = {
  symbol: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  date: Date;
};

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  myCoins: Coin[];
  tradeHistory: Trade[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  myCoins: [
    {
      symbol: { type: String, required: true },
      amount: { type: Number, default: 0 },
      buyPrice: { type: Number, require: true },
    },
  ],
  tradeHistory: [
    {
      symbol: { type: String, required: true },
      side: { type: String, enum: ["buy", "sell"], required: true },
      price: { type: Number, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hash = await bcrypt.hash(this.password, SALT_HASH);
    this.password = hash;
    next();
  } catch (err) {
    next(err as Error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
