const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (v) => EMAIL_RE.test((v || '').trim());

export function validateEmail(v) {
  if (!v?.trim()) return 'Enter your email address.';
  if (!isEmail(v)) return 'Enter a valid email address, like name@example.com.';
  return '';
}

export function validatePassword(v) {
  if (!v) return 'Enter a password.';
  if (v.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include at least one letter and one number.';
  return '';
}

export function validateSignUp({ fullName, email, password, confirmPassword, terms }) {
  const errors = {};
  if (!fullName?.trim() || fullName.trim().length < 2) errors.fullName = 'Enter your full name.';
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  const pwError = validatePassword(password);
  if (pwError) errors.password = pwError;
  if (!confirmPassword) errors.confirmPassword = 'Re-enter your password.';
  else if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.';
  if (!terms) errors.terms = 'Accept the terms to create an account.';
  return errors;
}

export function validateSignIn({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

export function validateAddress(a) {
  const errors = {};
  if (!a.fullName?.trim()) errors.fullName = 'Enter the recipient name.';
  if (!/^\d{10}$/.test((a.phone || '').replace(/\s/g, ''))) errors.phone = 'Enter a 10-digit mobile number.';
  if (!a.line1?.trim()) errors.line1 = 'Enter the street address.';
  if (!a.city?.trim()) errors.city = 'Enter the city.';
  if (!a.state?.trim()) errors.state = 'Enter the state.';
  if (!/^\d{6}$/.test((a.pincode || '').trim())) errors.pincode = 'Enter a 6-digit PIN code.';
  return errors;
}
