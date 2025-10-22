import { User } from "../models/userModal";

type TradeData = {
  userId: string;
  symbol: string;
  price: number;
  amount: number;
};

export async function buy({ userId, symbol, price, amount = 1 }: TradeData) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const existingCoin = user.myCoins.find((coin) => coin.symbol === symbol);
  if (existingCoin) {
    existingCoin.amount += amount;
  } else {
    user.myCoins.push({ symbol, amount });
  }

  user.tradeHistory.push({
    symbol,
    side: "buy",
    price,
    amount,
    date: new Date(),
  });

  await user.save();

  return {
    message: "Trade successful",
    user,
  };
}

export async function sell({ userId, symbol, price, amount = 1 }: TradeData) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const existingCoin = user.myCoins.find((coin) => coin.symbol === symbol);
  if (!existingCoin) {
    throw new Error("You don't own this coin");
  }

  if (existingCoin.amount < amount) {
    throw new Error("Insufficient coin balance");
  }

  existingCoin.amount -= amount;

  if (existingCoin.amount <= 0) {
    user.myCoins = user.myCoins.filter((coin) => coin.symbol !== symbol);
  }

  user.tradeHistory.push({
    symbol,
    side: "sell",
    price,
    amount,
    date: new Date(),
  });

  await user.save();

  return {
    message: "Sell successful",
    user,
  };
}
