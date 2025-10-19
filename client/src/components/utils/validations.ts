export type ValidationErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export const validateForm = (
  email: string,
  password: string,
  confirmPassword: string,
  isRegister: boolean
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length <= 4) {
    errors.password = "Password must be at least 5 characters";
  }

  if (isRegister && password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
