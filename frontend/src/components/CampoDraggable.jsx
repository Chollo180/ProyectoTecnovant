import React, { useRef } from "react";
// Importa los hooks de react-dnd para arrastrar y soltar
import { useDrag, useDrop } from "react-dnd";
// Importación de estilos CSS
import "../styles/tabla.css";


// Componente que representa un campo arrastrable dentro de una zona
const CampoDraggable = ({ campo, index, moveCampo, removeCampo }) => {
  const ref = useRef(null);

  // Hook para permitir que otro campo se suelte sobre este
  const [, drop] = useDrop({
    accept: "campo",
    hover(item) {
      if (item.index === index) return;
      moveCampo(item.index, index);
      item.index = index;
    },
  });

  // Hook para hacer que el campo sea arrastrable
  const [{ isDragging }, drag] = useDrag({
    type: "campo",
    item: { campo, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Conecta tanto la funcionalidad de drag como de drop al mismo elemento
  drag(drop(ref));

  return (
    <div
      ref={ref} // Elemento sobre el que se aplican drag y drop
      className={`campo-draggable${isDragging ? " dragging" : ""}`} // Aplica clase visual si está siendo arrastrado
    >
      {/* Nombre del campo */}
      <span className="campo-draggable-nombre">{campo}</span>
      {/* Botón para eliminar el campo de la zona */}
      <button
        onClick={() => removeCampo(index)}
        className="campo-draggable-eliminar"
        title="Eliminar"
      >
        ×
      </button>
    </div>
  );
};

export default CampoDraggable;
