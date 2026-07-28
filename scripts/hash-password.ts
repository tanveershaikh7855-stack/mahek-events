/**
 * Generates a bcrypt hash for ADMIN_PASSWORD_HASH or a User row.
 *
 *   npm run auth:hash -- "your-strong-password"
 *
 * Paste the output into .env as ADMIN_PASSWORD_HASH. Never store the plaintext.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run auth:hash -- "your-password"');
  process.exit(1);
}

if (password.length < 10) {
  console.error("Refusing: use a password of at least 10 characters.");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("\nADMIN_PASSWORD_HASH=" + JSON.stringify(hash) + "\n");
});
