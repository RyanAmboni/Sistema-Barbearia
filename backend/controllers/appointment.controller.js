const { Appointment, Service, User } = require('../models');

exports.create = async (req, res) => {
  try {
    const { serviceId, scheduledAt } = req.body;
    if (!serviceId || !scheduledAt) return res.status(400).json({ message: 'Missing fields' });

    const appointment = await Appointment.create({ userId: req.userId, serviceId, scheduledAt });
    return res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listForUser = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({ where: { userId: req.userId }, include: [Service] });
    return res.json(appointments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.userId !== req.userId) return res.status(403).json({ message: 'Not allowed' });
    appointment.status = 'cancelled';
    await appointment.save();
    return res.json(appointment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
