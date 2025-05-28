import React from "react";
import "../styles/tabla.css";

const ResultadoTabla = ({ data, filas, columnas, valores, filtrosSeleccionados }) => {
  if (!filas.length || !valores.length) {
    return <p>Arrastra campos a "Filas" y "Valores" para ver resultados.</p>;
  }

  // Aplicar filtros seleccionados
  const datosFiltrados = data.filter((item) => {
    return Object.entries(filtrosSeleccionados).every(([campo, valor]) => {
      if (!valor || valor === "Todos") return true;
      return valor.includes(String(item[campo]));
    });
  });




  // Agrupar y sumar
  const resultado = {};
  datosFiltrados.forEach((item) => {
    const filaKey = filas.map(f => item[f]).join(" | ");
    const columnaKey = columnas.map(c => item[c]).join(" | ");
    const key = `${filaKey || ""} || ${columnaKey || ""}`;

    if (!resultado[key]) {
      resultado[key] = {};
      valores.forEach(v => resultado[key][v] = 0);
    }

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
          <th className="tabla-header">{filas.join(" / ")}</th>
          {columnas.length > 0 && <th className="tabla-header">{columnas.join(" / ")}</th>}
          {valores.map(v => (
            <th className="tabla-header" key={v}>{v}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {keys.map((k, i) => {
          const [fila, columna] = k.split(" || ");
          return (
            <tr className="tabla-fila" key={i}>
              <td className="tabla-celda">{fila}</td>
              {columnas.length > 0 && <td className="tabla-celda">{columna}</td>}
              {valores.map(v => (
                <td className="tabla-celda" key={v}>{resultado[k][v]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ResultadoTabla;
