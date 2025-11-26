const db = require('../db');

exports.getProfile = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email FROM users WHERE id = $1', [req.userId]);
    if (!result.rowCount) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const current = await db.query('SELECT id, name, email FROM users WHERE id = $1', [req.userId]);
    if (!current.rowCount) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = req.body;
    if (email && email !== current.rows[0].email) {
      const exists = await db.query('SELECT 1 FROM users WHERE email = $1 LIMIT 1', [email]);
      if (exists.rowCount) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const nextName = name || current.rows[0].name;
    const nextEmail = email || current.rows[0].email;
    const updated = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
      [nextName, nextEmail, req.userId]
    );

    return res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
