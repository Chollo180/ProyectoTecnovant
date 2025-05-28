import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import "../styles/tabla.css";

const CampoDraggable = ({ campo, index, moveCampo, removeCampo }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "campo",
    hover(item) {
      if (item.index === index) return;
      moveCampo(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "campo",
    item: { campo, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`campo-draggable${isDragging ? " dragging" : ""}`}
    >
      <span className="campo-draggable-nombre">{campo}</span>
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
