import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CampoDisponible from "./CampoDisponible";
import Zona from "./Zona";
import ResultadoTabla from "./ResultadoTabla";
import FiltrosInteractivos from "./FiltrosInteractivos"; // ✅ Nuevo componente
import "../styles/tabla.css";

const campos = [
  "Finca",
  "Area",
  "Cliente",
  "Dron",
  "Fecha_Programacion",
  "Fecha_Ejecucion",
  "Mes",
  "Precio",
  "Total_Factura",
  "Corte_Factura",
  "Factura",
];

const TablaDinamica = ({ data }) => {
  const [filas, setFilas] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [valores, setValores] = useState([]);
  const [filtros, setFiltros] = useState([]);
  const [disponibles, setDisponibles] = useState(campos);

  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({}); // ✅ Nuevo estado

  return (
    <DndProvider backend={HTML5Backend}>
      <h2 className="tabla-titulo">Tabla Dinámica Personalizada</h2>

      {/* Contenedor de zonas de lógica */}
      <div className="tabla-zonas">
        <div className="pvtRows">
          <Zona title="Filas" campos={filas} setCampos={setFilas} />
        </div>
        <div className="pvtCols">
          <Zona title="Columnas" campos={columnas} setCampos={setColumnas} />
        </div>
        <div className="pvtVals">
          <Zona title="Valores" campos={valores} setCampos={setValores} />
        </div>
        <div className="pvtUnused">
          <Zona title="Filtros" campos={filtros} setCampos={setFiltros} />
        </div>
      </div>

      {/* Filtros interactivos */}
      <FiltrosInteractivos
        data={data}
        filtros={filtros}
        filtrosSeleccionados={filtrosSeleccionados}
        setFiltrosSeleccionados={setFiltrosSeleccionados}
      />

      {/* Campos disponibles */}
      <div className="campos-disponibles-contenedor">
        <h4 className="campos-disponibles-titulo">Campos disponibles</h4>
        <div className="campos-disponibles">
          {disponibles.map((campo) => (
            <CampoDisponible key={campo} campo={campo} />
          ))}
        </div>
      </div>

      {/* Resultado de tabla */}
      <ResultadoTabla
        data={data}
        filas={filas}
        columnas={columnas}
        valores={valores}
        filtrosSeleccionados={filtrosSeleccionados}
      />
    </DndProvider>
  );
};

export default TablaDinamica;
