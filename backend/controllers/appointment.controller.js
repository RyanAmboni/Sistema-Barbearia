const supabase = require("../config/supabase");

const mapAppointment = (row) => {
  const appointment = {
    id: row.id,
    userId: row.user_id,
    serviceId: row.service_id,
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

exports.create = async (req, res) => {
  console.log(`📅 Create appointment: ${JSON.stringify(req.body)}`);
  try {
    const { serviceId, scheduledAt } = req.body;
    if (!serviceId || !scheduledAt) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Verificar se serviço existe
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id")
      .eq("id", serviceId)
      .single();

    if (serviceError || !service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const finalDate = new Date(scheduledAt);
    if (Number.isNaN(finalDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("appointments")
      .insert({
        user_id: req.userId,
        service_id: serviceId,
        scheduled_at: finalDate.toISOString(),
        status: "scheduled",
      })
      .select("id, user_id, service_id, scheduled_at, status")
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
    // Verificar se o usuário é barbeiro
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", req.userId)
      .single();

    if (userError || !user || user.role !== "barbeiro") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { data: appointments, error } = await supabase
      .from("appointments")
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
      .neq("status", "cancelled")
      .order("scheduled_at", { ascending: true });

    if (error) throw error;

    // Buscar dados dos clientes separadamente
    const userIds = [...new Set(appointments.map(a => a.user_id))];
    const { data: users } = await supabase
      .from("users")
      .select("id, name, email")
      .in("id", userIds);

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
      .select("id, user_id, service_id, scheduled_at, status")
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
