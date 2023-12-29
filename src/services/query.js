export const findQuery = (credential) => {
  let query = {};

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential)) {
    // If the credential follows a basic email format, consider it as an email
    query = { email: credential };
  } else if (/^\d+$/.test(credential)) {
    // If the credential contains only numbers, consider it as a phone
    query = { phone: credential };
  } else if (/^[a-zA-Z0-9_-]+$/.test(credential)) {
    // If the credential contains only letters, numbers, underscore, and hyphen, consider it as a username
    query = { username: credential };
  } else {
    // If none of the above conditions are met, you can handle it based on your requirements
    query.error = { status: 400, message: "Invalid credential format" };
    return query;
  }
  return query;
};
