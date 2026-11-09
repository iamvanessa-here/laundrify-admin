const crypto = require('crypto');

/* Akun admin hardcoded (bisa diganti lewat .env). */
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/* Token aktif disimpan di memori server; hilang saat server restart. */
const activeTokens = new Set();

const checkCredentials = (username, password) =>
  username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

const createToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  activeTokens.add(token);
  return token;
};

const isValidToken = (token) => activeTokens.has(token);

const deleteToken = (token) => activeTokens.delete(token);

module.exports = { checkCredentials, createToken, isValidToken, deleteToken };
