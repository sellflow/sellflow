export function validateEmail(email: string) {
  let emailRegex = /^\w+([\.-]?\w+)*@[a-z A-Z . 0-9]+([\.-]?\w+)$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string) {
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-z A-Z 0-9]{8,16}$/;
  return passwordRegex.test(password);
}

export default {
  validateEmail,
  validatePassword,
};
