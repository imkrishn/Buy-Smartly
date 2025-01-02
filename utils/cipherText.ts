import crypto from 'crypto';

// AES Encryption function
export function encryptEmail(email: string, secretKey: string): string {
  console.log(email)
  console.log(secretKey);
  ;


  const key = crypto.createHash('sha256').update(secretKey).digest(); // Ensure the key is 32 bytes
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(email, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  // Return IV (for decryption) and encrypted data
  return iv.toString('hex') + ':' + encrypted;
}

// AES Decryption function
export function decryptEmail(encryptedEmail: string, secretKey: string): string {

  console.log(encryptEmail)
  console.log(secretKey);

  const key = crypto.createHash('sha256').update(secretKey).digest(); // Ensure the key is 32 bytes
  const [ivHex, encrypted] = encryptedEmail.split(':'); // Split the IV and encrypted data
  const iv = Buffer.from(ivHex, 'hex'); // Convert the IV from hex to a buffer
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv); // Set up the decipher
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8'); // Decrypt the data
  decrypted += decipher.final('utf-8'); // Finalize the decryption

  return decrypted;
}
