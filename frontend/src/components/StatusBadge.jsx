const STATUS_COLORS = {
  RECIBIDA: { bg: "#e0f2fe", text: "#0369a1" },
  DIAGNOSTICO: { bg: "#fef3c7", text: "#b45309" },
  EN_PROCESO: { bg: "#dbeafe", text: "#1d4ed8" },
  LISTA: { bg: "#dcfce7", text: "#15803d" },
  ENTREGADA: { bg: "#f3e8ff", text: "#6b21a8" },
  CANCELADA: { bg: "#fee2e2", text: "#b91c1c" },
};

export const StatusBadge = ({ status }) => {
     color style = STATUS_COLORS[status] || { bg: '#f3f4f6', text: '#374151' }
return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block',
      }}
    >
      {status}
    </span>
  );
};

    
