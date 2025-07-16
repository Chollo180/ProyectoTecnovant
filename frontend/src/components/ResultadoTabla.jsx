import React from "react";
// Importación de estilos CSS
import "../styles/tabla.css";

// Función para formatear números como moneda colombiana
function formatearMoneda(valor) {
  if (valor === null || valor === undefined || valor === "" || isNaN(valor)) return "-";
  return new Intl.NumberFormat("es-CO").format(Number(valor));
}

// Componente que muestra el resultado de la tabla dinámica según la configuración actual
const ResultadoTabla = ({ data, filas, columnas, valores, filtrosSeleccionados }) => {
  if (!filas.length || !valores.length) {
    return <p>Arrastra campos a "Filas" y "Valores" para ver resultados.</p>;
  }

  // Aplica los filtros seleccionados a los datos
  const datosFiltrados = data.filter((item) => {
    return Object.entries(filtrosSeleccionados).every(([campo, valor]) => {
      if (
        !valor ||
        valor === "Todos" ||
        (Array.isArray(valor) && valor.length === 0)
      ) {
        return true; // No hay un filtro activo para este campo
      }
      if (Array.isArray(valor)) {
        return valor.includes(String(item[campo])); 
      }
      return String(item[campo]) === String(valor); 
    });
  });




  // Agrupa los datos y suma los valores numéricos por combinación de filas y columnas
  const resultado = {};
  datosFiltrados.forEach((item) => {
    const filaKey = filas.map(f => item[f]).join(" | ");
    const columnaKey = columnas.map(c => item[c]).join(" | ");
    const key = `${filaKey || ""} || ${columnaKey || ""}`;

    // Inicializa el objeto de resultados si no existe
    if (!resultado[key]) {
      resultado[key] = {};
      valores.forEach(v => resultado[key][v] = 0);
    }

    // Suma los valores numéricos para cada campo de valor
    valores.forEach(v => {
      const valorNumerico = parseFloat(item[v]) || 0;
      resultado[key][v] += valorNumerico;
    });
  });

  const keys = Object.keys(resultado);

  return (
    <table className="tabla-resultado">
      <thead>
        <tr>
          {/* Encabezado de filas */}
          <th className="tabla-header">{filas.join(" / ")}</th>
          {/* Encabezado de columnas si existen */}
          {columnas.length > 0 && <th className="tabla-header">{columnas.join(" / ")}</th>}
          {/* Encabezados de los valores */}
          {valores.map(v => (
            <th className="tabla-header" key={v}>{v}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {keys.map((k, i) => {
          {/* Recorre cada combinación de fila/columna y muestra los resultados */}
          const [fila, columna] = k.split(" || ");
          return (
            <tr className="tabla-fila" key={i}>
              <td className="tabla-celda">{fila}</td>
              {columnas.length > 0 && <td className="tabla-celda">{columna}</td>}
              {valores.map(v => (
                <td className="tabla-celda" key={v}>{formatearMoneda(resultado[k][v])}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ResultadoTabla;
