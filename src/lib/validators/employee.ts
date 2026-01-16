// --- VALIDATION LOGIC ---
export  function validateEmployeeName  (name: string)  {
  const alphaRegex = /^[a-zA-Z\s]+$/;
  if (!name.trim()) return "Name is required";
  if (!alphaRegex.test(name)) return "Name must contain only alphabets";
  return null;
};

export  function validatePasscode  (pass: string) {
  // Regex: First digit 1-9, followed by exactly 4 digits 0-9
  const passRegex = /^[1-9][0-9]{4}$/;
  if (!passRegex.test(pass))
    return "Passcode must be 5 digits and cannot start with 0";
  return null;
};