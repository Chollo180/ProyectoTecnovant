import React from "react";
// Importa el hook useDrag de react-dnd para hacer el campo arrastrable
import { useDrag } from "react-dnd";


// Componente que representa un campo disponible para arrastrar a una zona de la tabla dinámica
const CampoDisponible = ({ campo }) => {
  // useDrag permite que este componente sea arrastrable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "campo", // Define el tipo de elemento draggable
    item: { campo }, // Información que se pasa durante el drag
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Indica si el campo está siendo arrastrado
    }),
  }));

  return (
    <div
      ref={drag} // Asigna la referencia del drag al div contenedor
      style={{
        border: "1px solid gray",
        padding: "4px 8px",
        backgroundColor: "white",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* Muestra el nombre del campo */}
      {campo}
    </div>
  );
};

export default CampoDisponible;
