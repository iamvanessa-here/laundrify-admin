const authModel = require('../models/authModel');

const login = (req, res) => {
  const { username, password } = req.body || {};

  if (
    typeof username !== 'string' || !username.trim() ||
    typeof password !== 'string' || !password
  ) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      error: 'Username dan password wajib diisi',
    });
  }

  if (!authModel.checkCredentials(username.trim(), password)) {
    return res
      .status(401)
      .json({ success: false, message: 'Username atau password salah' });
  }

  res.status(200).json({
    success: true,
    message: 'Login berhasil',
    data: { token: authModel.createToken() },
  });
};

const logout = (req, res) => {
  authModel.deleteToken(req.token);
  res.status(200).json({ success: true, message: 'Sesi berakhir', data: null });
};

module.exports = { login, logout };
