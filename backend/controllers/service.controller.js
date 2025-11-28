const supabase = require('../config/supabase');

const mapService = (row) => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  durationMinutes: row.duration_minutes,
});

exports.list = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .order('id');

    if (error) throw error;
    
    return res.json(data.map(mapService));
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

    const { data, error } = await supabase
      .from('services')
      .insert({
        name,
        price: price ?? 0,
        duration_minutes: durationMinutes ?? 30,
      })
      .select('id, name, price, duration_minutes')
      .single();

    if (error) throw error;

    return res.status(201).json(mapService(data));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: current, error: fetchError } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { name, price, durationMinutes } = req.body;
    const nextName = name || current.name;
    const nextPrice = price ?? current.price;
    const nextDuration = durationMinutes ?? current.duration_minutes;

    const { data: updated, error: updateError } = await supabase
      .from('services')
      .update({
        name: nextName,
        price: nextPrice,
        duration_minutes: nextDuration,
      })
      .eq('id', id)
      .select('id, name, price, duration_minutes')
      .single();

    if (updateError) throw updateError;

    return res.json(mapService(updated));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
