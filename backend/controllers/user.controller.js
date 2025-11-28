const supabase = require('../config/supabase');

exports.getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', req.userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Buscar usuário atual
    const { data: current, error: fetchError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', req.userId)
      .single();

    if (fetchError || !current) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = req.body;
    
    // Verificar se email já está em uso (se mudou)
    if (email && email !== current.email) {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1)
        .single();
      
      if (existing) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const nextName = name || current.name;
    const nextEmail = email || current.email;
    
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({
        name: nextName,
        email: nextEmail,
      })
      .eq('id', req.userId)
      .select('id, name, email')
      .single();

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ message: 'Server error' });
    }

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Atualizar role de um usuário (apenas barbeiros podem fazer isso)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: 'userId e role são obrigatórios' });
    }

    // Validar role
    if (role !== 'cliente' && role !== 'barbeiro') {
      return res.status(400).json({ 
        message: 'Role inválida. Use "cliente" ou "barbeiro"' 
      });
    }

    // Verificar se o usuário alvo existe
    const { data: targetUser, error: fetchError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', userId)
      .single();

    if (fetchError || !targetUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Não permitir que um barbeiro remova sua própria role de barbeiro
    if (targetUser.id === req.userId && role === 'cliente') {
      return res.status(403).json({ 
        message: 'Você não pode remover sua própria role de barbeiro' 
      });
    }

    // Atualizar role
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select('id, name, email, role')
      .single();

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ message: 'Erro ao atualizar role do usuário' });
    }

    return res.json({
      message: `Role do usuário ${updated.name} atualizada para ${role}`,
      user: updated
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * Listar todos os usuários (apenas barbeiros)
 */
exports.listUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }

    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};
