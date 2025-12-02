import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Agenda from "../components/Agenda";
import KPIDashboard from "../components/KPIDashboard"; // ��.��? NOVO: Importar Dashboard de KPI
import api from "../api";

// Componente para o toast de confirmação
const ConfirmToast = ({ closeToast, onConfirm }) => (
  <div className="confirm-toast">
    <p className="confirm-toast-message">Tem certeza que deseja cancelar?</p>
    <div className="confirm-toast-buttons">
      <button
        className="confirm-toast-btn confirm-toast-btn-yes"
        onClick={async () => {
          await onConfirm();
          closeToast();
        }}
      >
        SIM
      </button>
      <button
        className="confirm-toast-btn confirm-toast-btn-no"
        onClick={closeToast}
      >
        NÃO
      </button>
    </div>
  </div>
);

function MyAppointmentsPage({ user, barbeiro, activeModule = "agenda" }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (barbeiro) return;
    loadAppointments();
  }, [barbeiro]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/appointments");
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      toast.error("Erro ao carregar seus agendamentos.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const map = {
      scheduled: "Aguardando",
      accepted: "Confirmado",
      completed: "Finalizado",
      rejected: "Recusado",
      cancelled: "Cancelado",
    };
    return map[status] || status;
  };

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("pt-BR");
    }
    return typeof value === "string" ? value : "";
  };

  const formatTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return typeof value === "string" ? value : "";
  };

  const canCancel = (status) => ["scheduled", "accepted"].includes(status);

  const handleCancel = (appointmentId) => {
    const confirmCancellation = async () => {
      try {
        await api.del(`/api/appointments/${appointmentId}`);
        setAppointments((currentAppointments) =>
          currentAppointments.filter((appt) => appt.id !== appointmentId)
        );
        toast.success("Agendamento cancelado.");
      } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        toast.error(
          error?.data?.message ||
            error?.message ||
            "Não foi possível cancelar o agendamento."
        );
      }
    };

    toast(<ConfirmToast onConfirm={confirmCancellation} />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });
  };

  const upcomingCount = appointments.filter((a) =>
    ["accepted", "scheduled"].includes(a.status)
  ).length;
  const completedCount = appointments.filter((a) => a.status === "completed")
    .length;

  if (barbeiro) {
    return (
      <div className="page-content barbeiro-page">
        <h1 className="page-title">PAINEL DO BARBEIRO</h1>
        <div className="barbeiro-modules">
          <div className="module-content">
            {activeModule === "agenda" && <Agenda />}
            {activeModule === "kpis" && <KPIDashboard />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Meus Horários</h1>
      {loading ? (
        <p className="info-message">Carregando seus agendamentos...</p>
      ) : (
        <div className="appointments-list">
          {upcomingCount === 0 && completedCount > 0 && (
            <p className="info-message">Você não possui agendamentos futuros.</p>
          )}
          {appointments.length === 0 && (
            <p className="info-message">Você ainda não fez nenhum agendamento.</p>
          )}
          {appointments.map((appt) => {
            const isFinished = [
              "completed",
              "cancelled",
              "rejected",
            ].includes(appt.status);
            const serviceName =
              typeof appt.service === "string"
                ? appt.service
                : appt.service?.name || "Serviço";
            const dateValue = appt.scheduledAt || appt.date;
            const timeValue = appt.scheduledAt || appt.time;

            return (
              <div
                key={appt.id}
                className={`appointment-card ${isFinished ? "finished" : ""}`}
              >
                <div className="card-content">
                  <h3>{serviceName}</h3>
                  <p>
                    <strong>Data:</strong> {formatDate(dateValue)}
                  </p>
                  <p>
                    <strong>Horário:</strong> {formatTime(timeValue)}
                  </p>
                </div>
                <div className="card-footer">
                  <span className="status-badge">{getStatusLabel(appt.status)}</span>
                  {canCancel(appt.status) && (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(appt.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyAppointmentsPage;
