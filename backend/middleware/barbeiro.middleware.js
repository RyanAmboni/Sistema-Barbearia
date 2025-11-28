const supabase = require('../config/supabase');

/**
 * Middleware para verificar se o usuário autenticado é um barbeiro
 */
const barbeiroMiddleware = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Buscar role do usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.role !== 'barbeiro') {
      return res.status(403).json({ 
        message: 'Acesso negado. Apenas barbeiros podem realizar esta ação.' 
      });
    }

    req.userRole = user.role;
    next();
  } catch (err) {
    console.error('Barbeiro middleware error:', err);
    return res.status(500).json({ message: 'Erro ao verificar permissões' });
  }
};

module.exports = barbeiroMiddleware;

