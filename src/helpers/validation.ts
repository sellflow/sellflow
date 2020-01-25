export const INVALID_EMAIL_MESSAGE = t('Email is not valid');
export const INVALID_PASSWORD_MESSAGE = t(
  'Password is too short (minimum is 5 characters)',
);

export function validateEmail(email: string) {
  let emailRegex = /^\w+([\.-]?\w+)*@[a-z A-Z . 0-9]+([\.-]?\w+)$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string) {
  return password.length >= 5;
}

export default {
  validateEmail,
  validatePassword,
};
