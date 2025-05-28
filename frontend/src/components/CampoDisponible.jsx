import React from "react";
import { useDrag } from "react-dnd";

const CampoDisponible = ({ campo }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "campo",
    item: { campo },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        border: "1px solid gray",
        padding: "4px 8px",
        backgroundColor: "white",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {campo}
    </div>
  );
};

export default CampoDisponible;
