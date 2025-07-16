import React from "react";
// Importación de estilos CSS
import "../styles/tabla.css";

// Componente para mostrar y manejar filtros interactivos sobre los datos de la tabla dinámica
const FiltrosInteractivos = ({ data, filtros, filtrosSeleccionados, setFiltrosSeleccionados }) => {
  // Función que obtiene valores únicos del campo para usarlos como opciones de filtro
  const obtenerOpciones = (campo) => {
    const opciones = new Set();
    data.forEach((item) => {
      if (item[campo] !== undefined) {
        opciones.add(item[campo]);
      }
    });
    return [...opciones];
  };

  // Función que maneja el cambio de selección de un filtro
  // Si el valor ya está seleccionado, lo elimina; si no, lo agrega
  const toggleSeleccion = (campo, valor) => {
    const seleccionActual = filtrosSeleccionados[campo] || [];
    const nuevoFiltro = seleccionActual.includes(valor)
      ? seleccionActual.filter((v) => v !== valor) // Quita el valor si ya estaba seleccionado
      : [...seleccionActual, valor];  // Agrega el valor si no estaba seleccionado


    // Actualiza el estado de los filtros seleccionados
    setFiltrosSeleccionados({
      ...filtrosSeleccionados,
      [campo]: nuevoFiltro,
    });
  };

  return (
    <div className="filtros-contenedor">
      <h4 className="filtros-titulo">Filtros activos</h4>
      {/* Recorre los campos seleccionados como filtros y muestra sus opciones */}
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
