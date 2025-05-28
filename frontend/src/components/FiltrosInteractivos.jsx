import React from "react";
import "../styles/tabla.css";

const FiltrosInteractivos = ({ data, filtros, filtrosSeleccionados, setFiltrosSeleccionados }) => {
  const obtenerOpciones = (campo) => {
    const opciones = new Set();
    data.forEach((item) => {
      if (item[campo] !== undefined) {
        opciones.add(item[campo]);
      }
    });
    return [...opciones];
  };

  const toggleSeleccion = (campo, valor) => {
    const seleccionActual = filtrosSeleccionados[campo] || [];
    const nuevoFiltro = seleccionActual.includes(valor)
      ? seleccionActual.filter((v) => v !== valor)
      : [...seleccionActual, valor];

    setFiltrosSeleccionados({
      ...filtrosSeleccionados,
      [campo]: nuevoFiltro,
    });
  };

  return (
    <div className="filtros-contenedor">
      <h4 className="filtros-titulo">Filtros activos</h4>
      {filtros.map((campo) => (
        <div key={campo} className="filtro-campo">
          <strong className="filtro-campo-nombre">{campo}</strong>
          <div className="filtro-opciones">
            {obtenerOpciones(campo).map((valor) => (
              <label key={valor} className="filtro-label">
                <input
                  type="checkbox"
                  checked={filtrosSeleccionados[campo]?.includes(valor) || false}
                  onChange={() => toggleSeleccion(campo, valor)}
                />
                {` ${valor}`}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FiltrosInteractivos;
