const { Service } = require('../models');

exports.list = async (req, res) => {
  try {
    const services = await Service.findAll();
    return res.json(services);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, price, durationMinutes } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const service = await Service.create({ name, price: price || 0, durationMinutes: durationMinutes || 30 });
    return res.status(201).json(service);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    const { name, price, durationMinutes } = req.body;
    service.name = name || service.name;
    service.price = price !== undefined ? price : service.price;
    service.durationMinutes = durationMinutes !== undefined ? durationMinutes : service.durationMinutes;
    await service.save();
    return res.json(service);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    await service.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
