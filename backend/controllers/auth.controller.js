const supabase = require("../config/supabase");
const db = require("../db");

const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
});

exports.register = async (req, res) => {
  try {
    // Verificar se Supabase está configurado
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase not configured:", {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
      return res.status(500).json({ 
        message: "Server configuration error. Please contact support.",
        error: "Supabase environment variables not configured"
      });
    }

    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    
    // Restringir: apenas clientes podem se registrar diretamente
    // Barbeiros devem ser criados por outros barbeiros através do endpoint de atualização de role
    const userRole = "cliente";
    
    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1)
      .single();
    
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    
    // Criar usuário no Supabase Auth usando admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name,
        role: userRole,
      },
    });

    if (authError) {
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        return res.status(409).json({ message: "Email already in use" });
      }
      console.error("Auth error:", authError);
      console.error("Auth error details:", JSON.stringify(authError, null, 2));
      return res.status(500).json({ 
        message: "Error creating user",
        error: authError.message || "Unknown error",
        details: process.env.NODE_ENV === 'development' ? authError : undefined
      });
    }

    // Criar perfil na tabela users
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        name,
        email,
        role: userRole,
      })
      .select()
      .single();

    if (profileError) {
      // Se falhar ao criar perfil, tentar deletar o usuário de auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.error("Profile error:", profileError);
      console.error("Profile error details:", JSON.stringify(profileError, null, 2));
      return res.status(500).json({ 
        message: "Error creating user profile",
        error: profileError.message || "Unknown error",
        details: process.env.NODE_ENV === 'development' ? profileError : undefined
      });
    }

    return res.status(201).json(publicUser(profileData));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Criar o primeiro barbeiro do sistema
 * Este endpoint só funciona se não houver barbeiros no sistema ainda
 */
exports.createFirstBarbeiro = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Campos obrigatórios: name, email, password" });
    }

    // Verificar se já existe algum barbeiro no sistema
    const { data: existingBarbeiros, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("role", "barbeiro")
      .limit(1);

    if (checkError) {
      console.error("Error checking barbeiros:", checkError);
      return res.status(500).json({ message: "Erro ao verificar barbeiros existentes" });
    }

    if (existingBarbeiros && existingBarbeiros.length > 0) {
      return res.status(403).json({ 
        message: "Já existem barbeiros no sistema. Use o endpoint /api/users/role para criar novos barbeiros." 
      });
    }

    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1)
      .single();
    
    if (existingUser) {
      return res.status(409).json({ message: "Email já está em uso" });
    }
    
    // Criar usuário no Supabase Auth usando admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: "barbeiro",
      },
    });

    if (authError) {
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        return res.status(409).json({ message: "Email já está em uso" });
      }
      console.error("Auth error:", authError);
      return res.status(500).json({ message: "Erro ao criar usuário" });
    }

    // Criar perfil na tabela users com role barbeiro
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        name,
        email,
        role: "barbeiro",
      })
      .select()
      .single();

    if (profileError) {
      // Se falhar ao criar perfil, tentar deletar o usuário de auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.error("Profile error:", profileError);
      return res.status(500).json({ message: "Erro ao criar perfil do usuário" });
    }

    return res.status(201).json({
      message: "Primeiro barbeiro criado com sucesso!",
      user: publicUser(profileData)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Autenticar com Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return res.status(500).json({ message: "Error fetching user profile" });
    }

    // Validar se o perfil selecionado corresponde ao perfil do usuário
    if (role && role !== profile.role) {
      return res.status(403).json({ 
        message: `Você não tem permissão para acessar como ${role}. Seu perfil é ${profile.role}.` 
      });
    }

    // Retornar token do Supabase e dados do usuário
    return res.json({
      token: authData.session.access_token,
      user: publicUser(profile),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
