import React, { useEffect, useState } from "react";
import axios from "axios";
import TablaDinamica from "../components/TablaDinamica";
import "../styles/tabla.css";

const TablaDinamicaPage = () => {
  const [data, setData] = useState([]);
  const [mostrarSinFactura, setMostrarSinFactura] = useState(false);

  const obtenerDatos = () => {
    axios.get("http://localhost:5000/programacion/programaciones")
      .then((res) => {
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

        const datosFiltrados = mostrarSinFactura
          ? datosPlano.filter(item => !item.Factura || String(item.Factura).trim() === "")
          : datosPlano;

        setData(datosFiltrados);
      });
  };

  useEffect(() => {
    obtenerDatos();
  }, [mostrarSinFactura]);

  return (
    <div>
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
