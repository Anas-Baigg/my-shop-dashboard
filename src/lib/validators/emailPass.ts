export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string) {
  const v = value.trim();
  if (!v) return "Email is required";
  if (!emailRegex.test(v)) return "Enter a valid email";
  return null;
}

export function validatePassword(
  value: string,
  { isSignUp = false }: { isSignUp?: boolean } = {}
) {
  if (!value) return "Password is required";

  // For login: only require non-empty
  if (!isSignUp) return null;

  if (value.length < 8)
    return "Password must be at least 8 characters";

  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);

  if (!hasLetter || !hasNumber)
    return "Use upper/lowercase letters and numbers";

  return null;
}