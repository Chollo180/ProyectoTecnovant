import React from "react";
import { useDrop } from "react-dnd";
import CampoDraggable from "./CampoDraggable";
import "../styles/tabla.css";

const Zona = ({ title, campos, setCampos }) => {
  const moveCampo = (fromIndex, toIndex) => {
    const updated = [...campos];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCampos(updated);
  };

  const removeCampo = (index) => {
    const updated = [...campos];
    updated.splice(index, 1);
    setCampos(updated);
  };

  const [{ isOver }, drop] = useDrop({
    accept: "campo",
    drop: (item) => {
      if (!campos.includes(item.campo)) {
        setCampos([...campos, item.campo]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`zona${isOver ? " zona-over" : ""}`}
    >
      <strong className="zona-title">{title}</strong>
      <div className="zona-campos">
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
