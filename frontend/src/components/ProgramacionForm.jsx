import React from "react";
// Importamos los estilos CSS principales del proyecto
import "../styles/index.css";


// Función para formatea valores numéricos como moneda en formato colombiano
function formatearMoneda(valor) {
  if (valor === null || valor === undefined || valor === "" || isNaN(valor)) return "-";
  return new Intl.NumberFormat("es-CO").format(Number(valor));
}

// Función para formatear una fecha de "YYYY-MM-DD" a "DD-MM-YYYY"
function formatearFecha(fecha) {
  if (!fecha) return "-";
  const [year, month, day] = fecha.split("-");
  return `${day}-${month}-${year}`;
}

// Componente principal que representa la interfaz gráfica del formulario de programación
const ProgramacionForm = ({
  form,
  handleChange,
  handleSubmit,
  handleClean,
  handleNew,
  handleUpdate,
  handleDelete,
  handleRowClick,
  fincas,
}) => {




  return (
    <div className="container">
      {/* Logo de la empresa */}
      <div className="logo-container">
        <img src="/logoTecnovant.png" alt="Logo" className="logo" />
      </div>

      <div className="sidebar">
        {/* Barra lateral con botones de acción */}
        <button className="menu-sidebar" type="button" onClick={handleUpdate}>Actualizar</button>
        <button className="menu-sidebar" type="button" onClick={handleClean}>Limpiar</button>
        <button className="menu-sidebar" type="button" onClick={handleNew}>Nuevo</button>
        <button className="menu-sidebar" type="submit" onClick={handleSubmit}>Guardar</button>
        <button className="menu-sidebar" onClick={() => window.open("/tabla-dinamica", "_blank")}>Tabla Dinámica</button>      
      </div>

      <div className="form-content">
        {/* Tabla que muestra registros existentes */}
        <div className="frame list-view">
          <table>
            <thead>
              <tr>
                <th>Finca</th>
                <th>Area</th>
                <th>Fecha Programación</th>
                <th>Fecha Ejecución</th>
                <th>Dron</th>
                <th>Corte Factura</th>
                <th>Mes</th>
                <th>Precio</th>
                <th>Total Factura</th>
                <th>Cliente</th>
                <th>Factura</th>
                <th>Acciones</th>  
              </tr>
            </thead>
            <tbody>
              {/* Recorre la lista de fincas y muestra cada una en una fila */}
              {fincas.map((finca) => (
                <tr key={finca.id} onClick={() => handleRowClick(finca)}>
                  <td>{finca.finca_nombre || "-"}</td>
                  <td>{finca.area || "-"}</td>
                  <td>{finca.trabajos?.map((t) => formatearFecha(t.fecha_inicio)).join(", ")}</td>
                  <td>{finca.trabajos?.map((t) => formatearFecha(t.fecha_final)).join(", ")}</td>
                  <td>{finca.dron_nombre || "-"}</td>
                  <td>{finca.trabajos?.map((t) => t.corte_facturacion ?? "-").join(", ")}</td>
                  <td>{finca.trabajos?.flatMap((t) => t.avances?.map((a) => a.avance_mes ?? "-") || []).join(", ")}</td>
                  <td>{finca.trabajos?.map((t) => formatearMoneda(t.precio)).join(", ")}</td>                  
                  <td>{finca.trabajos?.map((t) => formatearMoneda(t.total_factura)).join(", ")}</td>
                  <td>{finca.persona_nombre_completo || "-"}</td>
                  <td>{finca.trabajos?.map((t) => t.codigo_factura ?? "-").join(", ")}</td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(finca.id); }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Formulario para crear o editar registros */}
        <div className="frame">
          <form className="form-grid" onSubmit={handleSubmit}>
            {/* Genera inputs dinámicos, excluyendo claves foráneas */}
            {Object.keys(form)
            .filter((key) => !["fk_finca", "fk_trabajo", "fk_avance", "fk_persona", "fk_dron", "fk_factura"].includes(key))
            .map((key) => (
              <div className="form-group" key={key}>
                <label>{key.replace(/_/g, " ")}</label>
                <input
                  type={key.includes("Fecha") ? "date" : "text"}
                  name={key}
                  id={key === "Finca" ? "Finca" : undefined}
                  value={form[key]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgramacionForm;
