export function getFullName(firstName?: string, lastName?: string) {
  if (firstName && lastName) {
    return (firstName + ' ' + lastName).trim();
  } else if (firstName) {
    return firstName.trim();
  } else if (lastName) {
    return lastName.trim();
  } else {
    return '';
  }
}
