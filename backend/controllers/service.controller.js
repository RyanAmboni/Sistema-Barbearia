const db = require('../db');

const mapService = (row) => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  durationMinutes: row.duration_minutes,
});

exports.list = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, price, duration_minutes FROM services ORDER BY id');
    return res.json(result.rows.map(mapService));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, durationMinutes } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name required' });
    }

    const inserted = await db.query(
      'INSERT INTO services (name, price, duration_minutes) VALUES ($1, $2, $3) RETURNING id, name, price, duration_minutes',
      [name, price ?? 0, durationMinutes ?? 30]
    );

    return res.status(201).json(mapService(inserted.rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await db.query('SELECT id, name, price, duration_minutes FROM services WHERE id = $1', [id]);
    if (!current.rowCount) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { name, price, durationMinutes } = req.body;
    const nextName = name || current.rows[0].name;
    const nextPrice = price ?? current.rows[0].price;
    const nextDuration = durationMinutes ?? current.rows[0].duration_minutes;

    const updated = await db.query(
      'UPDATE services SET name = $1, price = $2, duration_minutes = $3 WHERE id = $4 RETURNING id, name, price, duration_minutes',
      [nextName, nextPrice, nextDuration, id]
    );

    return res.json(mapService(updated.rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) {
      return res.status(404).json({ message: 'Service not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
