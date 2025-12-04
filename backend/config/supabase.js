const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key no backend

if (!supabaseUrl || !supabaseKey) {
  const error = new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  console.error('Supabase configuration error:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
    keyPreview: supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'missing'
  });
  throw error;
}

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
};

// Client dedicado para queries (sempre usando a service role)
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, clientOptions);
// Client separado para operacoes de autenticacao para nao contaminar o contexto do admin
const supabaseAuth = createClient(supabaseUrl, supabaseKey, clientOptions);

// Manter compatibilidade com imports existentes (default retorna o admin)
supabaseAdmin.supabaseAdmin = supabaseAdmin;
supabaseAdmin.supabaseAuth = supabaseAuth;

module.exports = supabaseAdmin;
