/**
 * Helper functions para usar Supabase diretamente no frontend
 * Esta é uma alternativa ao uso da API REST do backend
 * 
 * Exemplo de uso:
 * import { supabaseApi } from './lib/supabaseApi';
 * 
 * // Autenticação
 * const { data, error } = await supabaseApi.signIn(email, password);
 * 
 * // Buscar agendamentos
 * const appointments = await supabaseApi.getAppointments();
 */

import { supabase } from './supabase';

export const supabaseApi = {
  // ============================================
  // Autenticação
  // ============================================
  
  /**
   * Fazer login
   */
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', data.user.id)
      .single();
    
    return {
      token: data.session.access_token,
      user: profile,
    };
  },
  
  /**
   * Registrar novo usuário
   */
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // name, role, etc.
      },
    });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Fazer logout
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  /**
   * Obter usuário atual
   */
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data: profile } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', user.id)
      .single();
    
    return profile;
  },
  
  // ============================================
  // Serviços
  // ============================================
  
  /**
   * Listar todos os serviços
   */
  getServices: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .order('id');
    
    if (error) throw error;
    return data.map(service => ({
      id: service.id,
      name: service.name,
      price: Number(service.price),
      durationMinutes: service.duration_minutes,
    }));
  },
  
  // ============================================
  // Agendamentos
  // ============================================
  
  /**
   * Listar agendamentos do usuário atual
   */
  getAppointments: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        user_id,
        service_id,
        scheduled_at,
        status,
        services (
          id,
          name,
          price,
          duration_minutes
        )
      `)
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(appointment => ({
      id: appointment.id,
      userId: appointment.user_id,
      serviceId: appointment.service_id,
      scheduledAt: appointment.scheduled_at,
      status: appointment.status,
      service: appointment.services ? {
        id: appointment.services.id,
        name: appointment.services.name,
        price: Number(appointment.services.price),
        durationMinutes: appointment.services.duration_minutes,
      } : null,
    }));
  },
  
  /**
   * Criar novo agendamento
   */
  createAppointment: async (serviceId, scheduledAt) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: user.id,
        service_id: serviceId,
        scheduled_at: scheduledAt,
        status: 'scheduled',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Cancelar agendamento
   */
  cancelAppointment: async (appointmentId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .eq('user_id', user.id) // Garantir que só pode cancelar seus próprios agendamentos
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

export default supabaseApi;

