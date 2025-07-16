import React, { useEffect, useState } from "react";
// Importa axios para hacer solicitudes HTTP al backend
import axios from "axios";
// Importa el componente de tabla dinámica personalizada
import TablaDinamica from "../components/TablaDinamica";
// Importa de estilos CSS
import "../styles/tabla.css";

// Componente principal de la página de tabla dinámica
const TablaDinamicaPage = () => {
  // Estado para almacenar los datos obtenidos del backend
  const [data, setData] = useState([]);
  // Filtro para alternar entre todos o solo los que no tienen factura
  const [mostrarSinFactura, setMostrarSinFactura] = useState(false);

  // Función para obtener los datos del backend
  const obtenerDatos = () => {
    axios.get("http://localhost:5000/programacion/programaciones")
      .then((res) => {
        // Mapea los datos obtenidos para estructurarlos en un formato plano
        const datosPlano = res.data.map((item) => ({
          Finca: item.finca_nombre,
          Area: item.area,
          Cliente: item.persona_nombre_completo,
          Dron: item.dron_nombre,
          Fecha_Programacion: item.trabajos?.[0]?.fecha_inicio || "",
          Fecha_Ejecucion: item.trabajos?.[0]?.fecha_final || "",
          Mes: item.trabajos?.[0]?.avances?.[0]?.avance_mes || "",
          Precio: item.trabajos?.[0]?.precio || "",
          Total_Factura: item.trabajos?.[0]?.total_factura || "",
          Corte_Factura: item.trabajos?.[0]?.corte_facturacion || "",
          Factura: item.trabajos?.[0]?.codigo_factura ?? null,
        }));

        // Filtra los datos si se selecciona mostrar solo los que no tienen factura
        const datosFiltrados = mostrarSinFactura
          ? datosPlano.filter(item => !item.Factura || String(item.Factura).trim() === "")
          : datosPlano;

        setData(datosFiltrados);
      });
  };

  // Obtiene los datos cada vez que cambia el filtro de "mostrarSinFactura"
  useEffect(() => {
    obtenerDatos();
  }, [mostrarSinFactura]);

  return (
    <div>
      {/* Botón para alternar entre mostrar todos o solo los registros sin factura */}
      <button
        onClick={() => setMostrarSinFactura(prev => !prev)}
        style={{
          marginBottom: "10px",
          padding: "8px 12px",
          backgroundColor: mostrarSinFactura ? "#ffcc00" : "#cccccc",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {mostrarSinFactura ? "Mostrando solo sin factura" : "Mostrando todos"}
      </button>
      <TablaDinamica data={data} />
    </div>
  );
};

export default TablaDinamicaPage;
