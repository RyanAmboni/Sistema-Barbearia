const supabase = require('../config/supabase');
const supabaseAuth = supabase.supabaseAuth || supabase;

const authMiddleware = async (req, res, next) => {
  console.log(`🔐 Auth middleware: ${req.method} ${req.path}`);
  const header = req.headers['authorization'];
  if (!header) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token error' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Malformed token' });

  try {
    // Verificar token com Supabase usando o client dedicado a auth
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = user.id;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
