const supabase = require('./config/supabase');

/**
 * Wrapper para manter compatibilidade com código existente que usa db.query()
 * 
 * IMPORTANTE: Para usar queries SQL diretas, você precisa criar uma função RPC no Supabase.
 * 
 * Execute este SQL no Supabase SQL Editor:
 * 
 * CREATE OR REPLACE FUNCTION execute_sql(query_text text, query_params jsonb DEFAULT '[]'::jsonb)
 * RETURNS jsonb
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   result jsonb;
 * BEGIN
 *   EXECUTE query_text INTO result USING query_params;
 *   RETURN result;
 * END;
 * $$;
 * 
 * OU migre gradualmente os controllers para usar a API do Supabase diretamente.
 */

const query = async (text, params = []) => {
  try {
    // Usar RPC para executar SQL direto
    // Esta função precisa ser criada no Supabase (veja comentário acima)
    const { data, error } = await supabase.rpc('execute_sql', {
      query_text: text,
      query_params: JSON.stringify(params)
    });
    
    if (error) {
      // Se RPC não existir, tentar adaptação básica para queries simples
      console.warn('RPC function not found, attempting basic query adaptation');
      return await adaptQuery(text, params);
    }
    
    // RPC retorna JSON, precisamos converter para formato compatível
    if (Array.isArray(data)) {
      return { rows: data, rowCount: data.length };
    }
    
    return { rows: data ? [data] : [], rowCount: data ? 1 : 0 };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Função auxiliar para adaptar queries simples quando RPC não está disponível
async function adaptQuery(text, params) {
  const queryUpper = text.trim().toUpperCase();
  const tableMatch = text.match(/FROM\s+(\w+)|INTO\s+(\w+)|UPDATE\s+(\w+)/i);
  const table = tableMatch ? (tableMatch[1] || tableMatch[2] || tableMatch[3]) : null;
  
  if (!table) {
    throw new Error('Could not determine table from query. Please create RPC function execute_sql in Supabase.');
  }
  
  if (queryUpper.startsWith('SELECT')) {
    let query = supabase.from(table).select('*');
    
    // Aplicar WHERE básico
    if (text.includes('WHERE') && params.length > 0) {
      const whereMatch = text.match(/WHERE\s+(\w+)\s*=\s*\$(\d+)/i);
      if (whereMatch) {
        const field = whereMatch[1];
        const paramIndex = parseInt(whereMatch[2]) - 1;
        if (params[paramIndex] !== undefined) {
          query = query.eq(field, params[paramIndex]);
        }
      }
    }
    
    // Aplicar LIMIT
    const limitMatch = text.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      query = query.limit(parseInt(limitMatch[1]));
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return { rows: data || [], rowCount: data?.length || 0 };
  }
  
  throw new Error('Complex queries require RPC function. Please create execute_sql function in Supabase.');
}

// Manter compatibilidade com código que pode usar pool
const pool = {
  query: query
};

module.exports = { pool, query };
