import { User } from "../models/userModal";

type TradeData = {
  userId: string;
  symbol: string;
  price: number;
  amount: number;
};

export async function buy({ userId, symbol, price, amount = 1 }: TradeData) {
  if (!userId || !symbol) throw new Error("UserId and symbol are required");
  if (isNaN(price) || isNaN(amount) || price <= 0 || amount <= 0) {
    throw new Error("Price and amount must be positive numbers");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const existingCoin = user.myCoins.find((coin) => coin.symbol === symbol);

  if (existingCoin) {
    const existingAmount = Number(existingCoin.amount || 0);
    const existingBuyPrice = Number(existingCoin.buyPrice || 0);

    const totalAmount = existingAmount + amount;
    if (totalAmount === 0) {
      existingCoin.buyPrice = 0;
    } else {
      existingCoin.buyPrice =
        (existingBuyPrice * existingAmount + price * amount) / totalAmount;
    }

    existingCoin.amount = totalAmount;
  } else {
    user.myCoins.push({
      symbol,
      amount,
      buyPrice: price,
    });
  }

  user.tradeHistory.push({
    symbol,
    side: "buy",
    price,
    amount,
    date: new Date(),
  });

  await user.save();

  return { message: "Trade successful", user };
}

export async function sell({ userId, symbol, price, amount = 1 }: TradeData) {
  if (!userId || !symbol) throw new Error("UserId and symbol are required");
  if (isNaN(price) || isNaN(amount) || price <= 0 || amount <= 0) {
    throw new Error("Price and amount must be positive numbers");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const existingCoin = user.myCoins.find((coin) => coin.symbol === symbol);
  if (!existingCoin) throw new Error("You don't own this coin");

  const existingAmount = Number(existingCoin.amount || 0);
  if (existingAmount < amount) throw new Error("Insufficient coin balance");

  existingCoin.amount = existingAmount - amount;

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

  return { message: "Sell successful", user };
}
