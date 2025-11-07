const db = require('../db');

const mapAppointment = (row) => {
  const appointment = {
    id: row.id,
    userId: row.user_id,
    serviceId: row.service_id,
    scheduledAt: row.scheduled_at,
    status: row.status,
  };

  if (row.service_id && row.service_name) {
    appointment.service = {
      id: row.service_id,
      name: row.service_name,
      price: row.service_price !== null ? Number(row.service_price) : null,
      durationMinutes: row.service_duration_minutes,
    };
  }

  return appointment;
};

exports.create = async (req, res) => {
  try {
    const { serviceId, scheduledAt } = req.body;
    if (!serviceId || !scheduledAt) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const service = await db.query('SELECT id FROM services WHERE id = $1', [serviceId]);
    if (!service.rowCount) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const finalDate = new Date(scheduledAt);
    if (Number.isNaN(finalDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }

    const inserted = await db.query(
      'INSERT INTO appointments (user_id, service_id, scheduled_at, status) VALUES ($1, $2, $3, $4) RETURNING id, user_id, service_id, scheduled_at, status',
      [req.userId, serviceId, finalDate.toISOString(), 'scheduled']
    );

    return res.status(201).json(mapAppointment(inserted.rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listForUser = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        a.id,
        a.user_id,
        a.service_id,
        a.scheduled_at,
        a.status,
        s.name AS service_name,
        s.price AS service_price,
        s.duration_minutes AS service_duration_minutes
      FROM appointments a
      LEFT JOIN services s ON s.id = a.service_id
      WHERE a.user_id = $1
      ORDER BY a.scheduled_at DESC`,
      [req.userId]
    );

    return res.json(result.rows.map(mapAppointment));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await db.query(
      'SELECT id, user_id, service_id, scheduled_at, status FROM appointments WHERE id = $1',
      [id]
    );

    if (!appointment.rowCount) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.rows[0].user_id !== req.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const updated = await db.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING id, user_id, service_id, scheduled_at, status',
      ['cancelled', id]
    );

    return res.json(mapAppointment(updated.rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
