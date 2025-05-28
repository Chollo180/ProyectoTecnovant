import React from "react";
import "../styles/index.css";

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
      <div className="logo-container">
        <img src="/logoTecnovant.png" alt="Logo" className="logo" />
      </div>

      <div className="sidebar">
        <button className="menu-sidebar" type="button" onClick={handleUpdate}>Actualizar</button>
        <button className="menu-sidebar" type="button" onClick={handleClean}>Limpiar</button>
        <button className="menu-sidebar" type="button" onClick={handleNew}>Nuevo</button>
        <button className="menu-sidebar" type="submit" onClick={handleSubmit}>Guardar</button>
        <button className="menu-sidebar" onClick={() => window.open("/tabla-dinamica", "_blank")}>Tabla Dinámica</button>      
      </div>

      <div className="form-content">
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
              {fincas.map((finca) => (
                <tr key={finca.id} onClick={() => handleRowClick(finca)}>
                  <td>{finca.finca_nombre || "-"}</td>
                  <td>{finca.area || "-"}</td>
                  <td>{finca.trabajos?.map((t) => t.fecha_inicio || "-").join(", ")}</td>
                  <td>{finca.trabajos?.map((t) => t.fecha_final ?? "-").join(", ")}</td>
                  <td>{finca.dron_nombre || "-"}</td>
                  <td>{finca.trabajos?.map((t) => t.corte_facturacion ?? "-").join(", ")}</td>
                  <td>{finca.trabajos?.flatMap((t) => t.avances?.map((a) => a.avance_mes ?? "-") || []).join(", ")}</td>
                  <td>{finca.trabajos?.map((t) => t.precio ?? "-").join(", ")}</td>                  
                  <td>{finca.trabajos?.map((t) => t.total_factura ?? "-").join(", ")}</td>
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

        <div className="frame">
          <form className="form-grid" onSubmit={handleSubmit}>
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
