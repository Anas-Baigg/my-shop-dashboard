// --- VALIDATION LOGIC ---
export  function validateEmployeeName  (name: string)  {
  const alphaRegex = /^[a-zA-Z\s]+$/;
    const trimmed = name.trim();
  if (!trimmed) return { ok: false as const , message : "Name is required."} ;
  if (!alphaRegex.test(trimmed)) return { ok: false as const , message :"Name must contain only alphabets"};
  return {ok: true as const, value : trimmed};
};

export  function validatePasscode  (pass: string) {
   const trimmed = pass.trim();
  // Regex: First digit 1-9, followed by exactly 4 digits 0-9
  const passRegex = /^[1-9][0-9]{4}$/;
  if (!passRegex.test(trimmed))
    return{
  ok: false as const,
  message: "Passcode must be 5 digits and cannot start with 0"
  } ;
    return { ok: true as const, value: Number(trimmed) };
};