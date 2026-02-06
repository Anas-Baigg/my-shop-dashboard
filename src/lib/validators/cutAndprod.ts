export function validateServiceName(name: string) {
  const alphaRegex = /^[a-zA-Z\s]+$/;
  const trimmed = name.trim();

  if (!trimmed)
    return { ok: false as const, message: "Name is required." };

  if (!alphaRegex.test(trimmed))
    return { ok: false as const, message: "Name must contain only alphabets." };

  return { ok: true as const, value: trimmed };
}

export function validatePrice(price: number) {
  if (price === null || price === undefined)
    return { ok: false as const, message: "Price is required." };

  if (typeof price !== "number" || isNaN(price))
    return { ok: false as const, message: "Price must be a valid number." };

  if (price <= 0)
    return { ok: false as const, message: "Price must be greater than 0." };

  return { ok: true as const, value: price };
}
