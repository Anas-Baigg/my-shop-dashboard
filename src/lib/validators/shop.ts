// lib/validators/shop.ts
export function validateShopName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false as const, message: "Name is required." };

  // letters, numbers, spaces only
  const nameRegex = /^[a-zA-Z0-9 ]+$/;
  if (!nameRegex.test(trimmed)) {
    return {
      ok: false as const,
      message: "Invalid Name: Only letters, numbers, and spaces allowed.",
    };
  }

  return { ok: true as const, value: trimmed };
}

export function validateAdminPassword(pass: string) {
  const trimmed = pass.trim();

  // exactly 5 digits AND first digit cannot be 0
  // valid: 10000..99999
  // invalid: 01234, 00000, 1234, 123456
  if (!/^[1-9]\d{4}$/.test(trimmed)) {
    return {
      ok: false as const,
      message: "Invalid Password: Must be exactly 5 digits and cannot start with 0 (e.g., 12345).",
    };
  }

  return { ok: true as const, value: Number(trimmed) };
}
