const supabase = require("../config/supabase");

const mapAppointment = (row) => {
  const appointment = {
    id: row.id,
    userId: row.user_id,
    serviceId: row.service_id,
    barberId: row.barbeiro_id,
    scheduledAt: row.scheduled_at,
    status: row.status,
  };

  if (row.services) {
    appointment.service = {
      id: row.services.id,
      name: row.services.name,
      price: row.services.price !== null ? Number(row.services.price) : null,
      durationMinutes: row.services.duration_minutes,
    };
  }

  if (row.users) {
    appointment.client = {
      name: row.users.name,
      email: row.users.email,
    };
  }

  return appointment;
};

const ensureBarberRole = async (userId) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !user || user.role !== "barbeiro") {
    const err = new Error("Not allowed");
    err.status = 403;
    throw err;
  }

  return user;
};

exports.create = async (req, res) => {
  console.log(`📅 Create appointment: ${JSON.stringify(req.body)}`);
  try {
    const { serviceId, scheduledAt } = req.body;
    if (!serviceId || !scheduledAt) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Verificar se serviço existe e obter duração
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id, duration_minutes")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const finalDate = new Date(scheduledAt);
    if (Number.isNaN(finalDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    // Verificar se o horário já está ocupado
    const startOfDay = new Date(finalDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(finalDate);
    endOfDay.setHours(23, 59, 59, 999);

    const serviceDuration = service.duration_minutes || 30;
    const serviceEndTime = new Date(finalDate.getTime() + serviceDuration * 60000);

    // Buscar agendamentos conflitantes no mesmo dia
    const { data: conflictingAppointments, error: conflictError } = await supabase
      .from("appointments")
      .select(`
        scheduled_at,
        services (
          duration_minutes
        )
      `)
      .gte("scheduled_at", startOfDay.toISOString())
      .lte("scheduled_at", endOfDay.toISOString())
      .neq("status", "cancelled");

    if (conflictError) throw conflictError;

    // Verificar se há conflito de horário
    const hasConflict = conflictingAppointments.some((appt) => {
      const apptStart = new Date(appt.scheduled_at);
      const apptDuration = appt.services?.duration_minutes || 30;
      const apptEnd = new Date(apptStart.getTime() + apptDuration * 60000);

      // Verificar sobreposição: o novo agendamento não pode começar durante outro
      // e outro agendamento não pode começar durante o novo
      return (
        (finalDate >= apptStart && finalDate < apptEnd) ||
        (apptStart >= finalDate && apptStart < serviceEndTime)
      );
    });

    if (hasConflict) {
      return res.status(409).json({ message: "Horário já está ocupado" });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("appointments")
      .insert({
        user_id: req.userId,
        service_id: serviceId,
        scheduled_at: finalDate.toISOString(),
        status: "scheduled",
      })
      .select("id, user_id, service_id, barbeiro_id, scheduled_at, status")
      .single();

    if (insertError) throw insertError;

    return res.status(201).json(mapAppointment(inserted));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listForUser = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        user_id,
        service_id,
        barbeiro_id,
        scheduled_at,
        status,
        services (
          id,
          name,
          price,
          duration_minutes
        )
      `)
      .eq("user_id", req.userId)
      .order("scheduled_at", { ascending: false });

    if (error) throw error;

    return res.json(data.map(mapAppointment));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listAll = async (req, res) => {
  try {
    await ensureBarberRole(req.userId);

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`
        id,
        user_id,
        service_id,
        barbeiro_id,
        scheduled_at,
        status,
        services (
          id,
          name,
          price,
          duration_minutes
        )
      `)
      .neq("status", "cancelled")
      .order("scheduled_at", { ascending: true });

    if (error) throw error;

    if (!appointments?.length) {
      return res.json([]);
    }

    // Buscar dados dos clientes separadamente
    const userIds = [...new Set(appointments.map((a) => a.user_id))];
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, name, email")
      .in("id", userIds);

    if (usersError) throw usersError;

    // Combinar dados
    const usersMap = new Map(users?.map(u => [u.id, u]) || []);
    const appointmentsWithClients = appointments.map(apt => {
      const appointment = mapAppointment(apt);
      const client = usersMap.get(apt.user_id);
      if (client) {
        appointment.client = {
          name: client.name,
          email: client.email,
        };
      }
      return appointment;
    });

    return res.json(appointmentsWithClients);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("id, user_id, service_id, barbeiro_id, scheduled_at, status")
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.user_id !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { data: updated, error: updateError } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select("id, user_id, service_id, scheduled_at, status")
      .single();

    if (updateError) throw updateError;

    return res.json(mapAppointment(updated));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    await ensureBarberRole(req.userId);

    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["accepted", "rejected", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Cancelled appointments cannot be updated" });
    }

    if (status !== "completed" && appointment.status !== "scheduled") {
      return res.status(400).json({ message: "Only scheduled appointments can be accepted or rejected" });
    }

    if (status === "completed" && appointment.status !== "accepted") {
      return res.status(400).json({ message: "Somente agendamentos aceitos podem ser finalizados" });
    }

    // Primeiro atualiza, depois busca as rela��es em uma query separada para evitar erro de coer��o de JSON
    const { data: updated, error: updateError } = await supabase
      .from("appointments")
      .update({ status, barbeiro_id: req.userId })
      .eq("id", id)
      .select("id")
      .single();

    if (updateError) {
      // Normalizar erros de constraint do banco para mensagens compreensíveis
      if (
        updateError?.code === "23514" ||
        /check constraint/.test(updateError?.message || "")
      ) {
        return res
          .status(400)
          .json({
            message:
              "Status inválido no banco. Atualize o schema (SUPABASE) para incluir accepted/rejected/completed.",
          });
      }

      throw updateError;
    }

    const { data: withRelations, error: fetchRelationsError } = await supabase
      .from("appointments")
      .select(
        "id, user_id, service_id, barbeiro_id, scheduled_at, status, services (id, name, price, duration_minutes), users!appointments_user_id_fkey (name, email)"
      )
      .eq("id", id)
      .maybeSingle();

    if (fetchRelationsError) throw fetchRelationsError;
    if (!withRelations) {
      return res.status(404).json({ message: "Appointment not found after update" });
    }

    return res.json(mapAppointment(withRelations));
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

exports.getOccupiedSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date parameter required" });
    }

    // Validar formato da data
    const dateObj = new Date(date + "T00:00:00");
    if (Number.isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Calcular início e fim do dia
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    // Buscar agendamentos do dia que não estão cancelados
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`
        scheduled_at,
        services (
          duration_minutes
        )
      `)
      .gte("scheduled_at", startOfDay.toISOString())
      .lte("scheduled_at", endOfDay.toISOString())
      .neq("status", "cancelled");

    if (error) throw error;

    // Extrair horários ocupados (formato HH:MM)
    // Um horário está ocupado se um serviço está em andamento naquele momento
    const occupiedSlots = new Set();
    appointments.forEach((appt) => {
      const scheduledDate = new Date(appt.scheduled_at);
      const duration = appt.services?.duration_minutes || 30;
      const startMinutes = scheduledDate.getHours() * 60 + scheduledDate.getMinutes();
      const endMinutes = startMinutes + duration;
      
      // Bloquear todos os slots de 30 em 30 minutos que estão durante a execução do serviço
      // Incluindo o horário de início, mas não o horário de término (pois o serviço termina antes)
      for (let min = startMinutes; min < endMinutes; min += 30) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        const slot = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        occupiedSlots.add(slot);
      }
    });

    return res.json({ occupiedSlots: Array.from(occupiedSlots).sort() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
