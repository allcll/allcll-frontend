export function getSeatColor(seats: number) {
  if (seats > 5)
    return "text-green-500 bg-green-100";
  if (seats > 0)
    return "text-yellow-500 bg-yellow-100";
  if (seats == 0)
    return "text-red-500 bg-red-100";

  return "text-gray-500 bg-gray-100";
}

export function getWishesColor(wishCount: number) {
  if (wishCount >= 100)
    return "text-red-500 bg-red-100";
  if (wishCount >= 50)
    return "text-yellow-500 bg-yellow-100";
  if (wishCount >= 0)
    return "text-green-500 bg-green-100";

  return "text-gray-500 bg-gray-100";
}