import React, { useState } from "react";
// Importamos el proveedor de contexto para drag-and-drop (arrastrar y soltar)
import { DndProvider } from "react-dnd";
// Backend para drag-and-drop compatible con HTML5
import { HTML5Backend } from "react-dnd-html5-backend";
// Importamos los componentes personalizados para la tabla dinámica
import CampoDisponible from "./CampoDisponible";
import Zona from "./Zona";
import ResultadoTabla from "./ResultadoTabla";
import FiltrosInteractivos from "./FiltrosInteractivos"; 
// Importación de estilos CSS
import "../styles/tabla.css";


// Lista de campos disponibles para construir la tabla dinámica
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


// Componente principal de la tabla dinámica
const TablaDinamica = ({ data }) => {
  const [filas, setFilas] = useState([]); // Estado para los campos seleccionados como filas
  const [columnas, setColumnas] = useState([]); // Estado para los campos seleccionados como columnas
  const [valores, setValores] = useState([]); // Estado para los campos seleccionados como valores
  const [filtros, setFiltros] = useState([]); // Estado para los campos seleccionados como filtros
  const [disponibles, setDisponibles] = useState(campos); // Estado para los campos disponibles que aún no han sido usados

  // Estado para los filtros seleccionados por el usuario
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState({}); // ✅ Nuevo estado

  return (
    <DndProvider backend={HTML5Backend}>
      <h2 className="tabla-titulo">Tabla Dinámica Personalizada</h2>

      {/* Contenedor de zonas de lógica para filas, columnas, valores y filtros */}
      <div className="tabla-zonas">
        <div className="pvtRows">
          {/* Zona para campos de filas */}
          <Zona title="Filas" campos={filas} setCampos={setFilas} />
        </div>
        <div className="pvtCols">
          {/* Zona para campos de columnas */}
          <Zona title="Columnas" campos={columnas} setCampos={setColumnas} />
        </div>
        <div className="pvtVals">
          {/* Zona para campos de valores */}
          <Zona title="Valores" campos={valores} setCampos={setValores} />
        </div>
        <div className="pvtUnused">
          {/* Zona para campos de filtros */}
          <Zona title="Filtros" campos={filtros} setCampos={setFiltros} />
        </div>
      </div>

      {/* Componente para mostrar y seleccionar filtros interactivos */}
      <FiltrosInteractivos
        data={data}
        filtros={filtros}
        filtrosSeleccionados={filtrosSeleccionados}
        setFiltrosSeleccionados={setFiltrosSeleccionados}
      />

      {/* Lista de campos disponibles para arrastrar a las zonas */}
      <div className="campos-disponibles-contenedor">
        <h4 className="campos-disponibles-titulo">Campos disponibles</h4>
        <div className="campos-disponibles">
          {disponibles.map((campo) => (
            <CampoDisponible key={campo} campo={campo} />
          ))}
        </div>
      </div>

      {/* Resultado final de la tabla dinámica según filtros y agrupaciones */}
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
