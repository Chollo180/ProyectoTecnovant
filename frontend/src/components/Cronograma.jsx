import React from "react";
import "../styles/index.css"

const Interfaz = ({
  form,
  handleChange,
  handleSubmit,
  handleClean,
  handleNew,
  handleUpdate,
  handleDelete,
  handleRowClick,
  fincas
}) => {
  return (
    <div className="container">
      <div className="logo-container">
        <img src="/logoTecnovant.png" alt="Logo" className="logo" />
      </div>

      <div className="sidebar">
        <button className="menu-sidebar" onClick={handleUpdate}>Actualizar</button>
        <button className="menu-sidebar" onClick={handleClean}>Limpiar</button>
        <button className="menu-sidebar" onClick={handleNew}>Nuevo</button>
        <button className="menu-sidebar" onClick={handleSubmit}>Guardar</button>
      </div>

      <div className="form-content">
        <div className="frame list-view">
          <table>
            <thead>
              <tr>
                <th>Finca</th>
                <th>Propietario</th>
                <th>Fecha Inicial</th>
                <th>Duración</th>
                <th>Progreso</th>
                <th>Fecha Final</th>
                <th>Estado</th>
                <th>Días Completados</th>
                <th>Hectáreas Terminadas</th>
                <th>Avance</th>
                <th>Mes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
            {fincas.map((finca) => (
              <tr key={finca.id} onClick={() => handleRowClick(finca)}>
                <td>{finca.nombre || "-"}</td>
                <td>{finca.persona_nombre_completo || "-"}</td>
                <td>{finca.trabajos?.map((t) => t.fecha_inicio || "-").join(", ")}</td>
                <td>{finca.trabajos?.map((t) => t.duracion ?? "-").join(", ")}</td>
                <td>{finca.trabajos?.map((t) => t.progreso ?? "-").join(", ")}</td>
                <td>{finca.trabajos?.map((t) => t.fecha_final ?? "-").join(", ")}</td>
                <td>{finca.trabajos?.map((t) => t.estado ?? "-").join(", ")}</td>
                <td>{finca.trabajos?.flatMap((t) => t.avances?.map((a) => a.dias_completados ?? "-")).join(", ")}</td>
                <td>{finca.trabajos?.flatMap((t) => t.avances?.map((a) => a.hectareas_terminadas ?? "-")).join(", ")}</td>
                <td>{finca.trabajos?.map((t) => t.avance_total ?? "-").join(", ")}</td>
                <td>{finca.trabajos?.flatMap((t) => t.avances?.map((a) => a.mes ?? "-")).join(", ")}</td>
                <td>
                  <button onClick={(e) => {e.stopPropagation(); handleDelete(finca.id);}}>
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
              .filter((key) => !["fk_finca", "fk_persona", "fk_trabajo", "fk_avance"].includes(key))
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

export default Interfaz;
