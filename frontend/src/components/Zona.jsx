import React from "react";
// Importamos el hook useDrop de react-dnd para habilitar la zona de drop (soltar)
import { useDrop } from "react-dnd";
// Importamos el componente que representa un campo que se puede arrastrar y soltar
import CampoDraggable from "./CampoDraggable";
// Importación de estilos CSS
import "../styles/tabla.css";


// Componente que representa una zona donde se pueden soltar campos (filas, columnas, valores o filtros)
const Zona = ({ title, campos, setCampos }) => {
  // Función para reordenar campos dentro de la misma zona
  const moveCampo = (fromIndex, toIndex) => {
    const updated = [...campos];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCampos(updated);
  };

   // Función para eliminar un campo de esta zona
  const removeCampo = (index) => {
    const updated = [...campos];
    updated.splice(index, 1);
    setCampos(updated);
  };

  // Define la zona como un área receptora de campos arrastrables react-dnd
  const [{ isOver }, drop] = useDrop({
    accept: "campo",
    drop: (item) => {
      if (!campos.includes(item.campo)) {
        setCampos([...campos, item.campo]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // Indica si un elemento está siendo arrastrado sobre la zona
    }),
  });

  return (
    <div
      ref={drop}// Asigna la zona como un área de drop para react-dnd
      className={`zona${isOver ? " zona-over" : ""}`}// Aplica una clase visual si hay un campo encima
    >
      {/* Título de la zona (Filas, Columnas, Valores, Filtros) */}
      <strong className="zona-title">{title}</strong>
      <div className="zona-campos">
        {/* Muestra los campos actuales de la zona, cada uno como un elemento arrastlable */}
        {campos.map((campo, index) => (
          <CampoDraggable
            key={campo}
            campo={campo}
            index={index}
            moveCampo={moveCampo}
            removeCampo={removeCampo}
          />
        ))}
      </div>
    </div>
  );
};

export default Zona;
