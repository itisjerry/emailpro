import crypto from 'crypto';

const ENC_KEY = process.env.ENCRYPTION_KEY || 'dev_key_dev_key_dev_key_dev!'; // 32 bytes
const IV_LENGTH = 12;

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENC_KEY.slice(0,32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
}

export function decrypt(data: string) {
  const [ivB64, tagB64, text] = data.split(':');
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENC_KEY.slice(0,32)), iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
