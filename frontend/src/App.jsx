import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css"; // Importar los estilos

const App = () => {
  const [fincas, setFincas] = useState([]);
  const [form, setForm] = useState({
    Finca: "",
    Ubicacion: "",
    Total_De_Hectareas: "",
    Propietario: "",
    Dron_Nombre: "",
    Fecha_Inicio: "",
    Fecha_Final: "",
    Estado: "",
    Duracion: "",
    Dias_Completados: "",
    Hectareas_Terminadas: "",
    Fecha: "",
  });

  

  useEffect(() => {
    fetchFincas();
  }, []);

  const fetchFincas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/todo");
      console.log("Datos recibidos de la API:", response.data);
      setFincas(response.data);
    } catch (error) {
      console.error("Error fetching fincas:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Separar nombres y apellidos
      const nombreArray = form.Propietario.trim().split(" ");
      const nombres = nombreArray.slice(0, -1).join(" ") || form.Propietario;
      const apellidos = nombreArray.slice(-1).join(" ") || "";

      const personaResponse = await axios.post("http://localhost:5000/persona", {
        nombres,
        apellidos,
      });
      
      const dronResponse = await axios.post("http://localhost:5000/dron", {
        nombre: form.Dron_Nombre,
      });

      const fincaResponse = await axios.post("http://localhost:5000/finca", {
        nombre: form.Finca,
        ubicacion: form.Ubicacion,
        total_hectareas: form.Total_De_Hectareas,
        fk_persona: personaResponse.data.id,
        fk_dron: dronResponse.data.id,
      });
      
      const trabajoResponse = await axios.post("http://localhost:5000/trabajo", {
        fecha_inicio: form.Fecha_Inicio,
        fecha_final: form.Fecha_Final,
        estado: form.Estado,
        duracion: form.Duracion,
        fk_finca: fincaResponse.data.id,
      });
      
      const avanceResponse = await axios.post("http://localhost:5000/avance", {
        dias_completados: form.Dias_Completados,
        hectareas_terminadas: form.Hectareas_Terminadas,
        fecha: form.Fecha,
        fk_trabajo: trabajoResponse.data.id,
      });

      fetchFincas();
    } catch (error) {
      console.error("Error creating records:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta finca y todos sus datos relacionados?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:5000/finca/relaciones/${id}`);
      alert("Finca eliminada correctamente");
      fetchFincas(); // Refrescar la lista después de eliminar
    } catch (error) {
      console.error("Error eliminando la finca:", error);
      alert("Hubo un error al eliminar la finca.");
    }
  };

  // Nueva función: Cargar datos de una fila en el formulario
  const handleRowClick = (finca) => {


    console.log(finca); // ✅ Verifica si fk_persona y fk_dron existen en la respuesta
  


    setForm({
      fk_finca: finca.id,
      Finca: finca.nombre,
      Ubicacion: finca.ubicacion,
      Total_De_Hectareas: finca.total_hectareas,
      
      // Capturar ID y nombre de la persona
      fk_persona: finca.fk_persona, 
      Propietario: finca.persona_nombre_completo,
  
      // Capturar ID y nombre del dron
      fk_dron: finca.fk_dron, 
      Dron_Nombre: finca.dron_nombre,
  
      // Capturar datos del trabajo
      fk_trabajo: finca.trabajos?.[0]?.id || "",
      Fecha_Inicio: finca.trabajos?.[0]?.fecha_inicio || "",
      Fecha_Final: finca.trabajos?.[0]?.fecha_final || "",
      Estado: finca.trabajos?.[0]?.estado || "",
      Duracion: finca.trabajos?.[0]?.duracion || "",
  
      // Capturar datos del avance
      fk_avance: finca.trabajos?.[0]?.avances?.[0]?.id || "",
      Dias_Completados: finca.trabajos?.[0]?.avances?.[0]?.dias_completados || "",
      Hectareas_Terminadas: finca.trabajos?.[0]?.avances?.[0]?.hectareas_terminadas || "",
      Fecha: finca.trabajos?.[0]?.avances?.[0]?.fecha || "",
    });
  };
  

  // Nueva función: Actualizar datos en el servidor
  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log("Enviando datos a la API:", form);
    try {
      // Asegurar que los IDs existen antes de actualizar
      if (!form.fk_finca) {
        alert("Error: No hay una finca seleccionada para actualizar.");
        return;
      }


      // Actualizar finca
      await axios.put(`http://localhost:5000/finca/${form.fk_finca}`, {
        nombre: form.Finca,
        ubicacion: form.Ubicacion,
        total_hectareas: form.Total_De_Hectareas,
        fk_persona: form.fk_persona || null,  // Si no hay persona, enviar NULL
        fk_dron: form.fk_dron || null,        // Si no hay dron, enviar NULL
      });
  
      // Actualizar persona solo si hay ID de persona
      if (form.fk_persona && form.Propietario.trim() !== "") {
        const nombreArray = form.Propietario.trim().split(" ");
        const nombres = nombreArray.slice(0, -1).join(" ") || form.Propietario;
        const apellidos = nombreArray.length > 1 ? nombreArray.slice(-1).join(" ") : "";
      
        // Verificar que fk_persona tenga un valor válido antes de actualizar
        if (!form.fk_persona) {
          console.warn("⚠ No hay ID de persona, se omitirá la actualización.");
        } else {
          console.log("Actualizando persona con:", {
            id: form.fk_persona,
            nombres,
            apellidos,
          });
      
          await axios.put(`http://localhost:5000/persona/${form.fk_persona}`, {
            nombres: nombres || "Desconocido", // Evitar que sea null
            apellidos,
          });
        }
      }
      
      
  
      // Actualizar dron solo si hay ID de dron
      if (form.fk_dron) {
        await axios.put(`http://localhost:5000/dron/${form.fk_dron}`, {
          nombre: form.Dron_Nombre,
        });
      }
  
      
      
  
      // Actualizar trabajo solo si hay ID de trabajo
      if (form.fk_trabajo) {
        await axios.put(`http://localhost:5000/trabajo/${form.fk_trabajo}`, {
          fecha_inicio: form.Fecha_Inicio,
          fecha_final: form.Fecha_Final,
          estado: form.Estado,
          duracion: form.Duracion,
          fk_finca: form.fk_finca,
        });
      }
  
      // Actualizar avance solo si hay ID de avance
      if (form.fk_avance) {
        await axios.put(`http://localhost:5000/avance/${form.fk_avance}`, {
          dias_completados: form.Dias_Completados,
          hectareas_terminadas: form.Hectareas_Terminadas,
          fecha: form.Fecha,
          fk_trabajo:form.fk_trabajo,
        });
      }
  
      alert("Datos actualizados correctamente");
      fetchFincas(); // Refrescar la lista
    } catch (error) {
      console.error("Error actualizando los datos:", error);
      alert("Hubo un error al actualizar los datos.");
    }
  };


  const handleNew = () => {
    setForm({
      Finca: "",
      Ubicacion: "",
      Total_De_Hectareas: "",
      Propietario: "",
      Dron_Nombre: "",
      Fecha_Inicio: "",
      Fecha_Final: "",
      Estado: "",
      Duracion: "",
      Dias_Completados: "",
      Hectareas_Terminadas: "",
      Fecha: "",
    });
  
    // Esperar un breve momento para asegurar que el estado se actualiza y luego enfocar el primer input
    setTimeout(() => {
      document.getElementById("Nombre")?.focus();
    }, 100);
  };

  const handleClean = () => {
    setForm({
      Finca: "",
      Ubicacion: "",
      Total_De_Hectareas: "",
      Propietario: "",
      Dron_Nombre: "",
      Fecha_Inicio: "",
      Fecha_Final: "",
      Estado: "",
      Duracion: "",
      Dias_Completados: "",
      Hectareas_Terminadas: "",
      Fecha: "",
    });
  };
  
  

  return (
    
    <div className="container">
      <div className="sidebar">
        {/* Logo en la barra lateral */}
        <img src="/logoTecnovantSinFondo.png" alt="Logo" className="logo" />
        <button className="menu-sidebar" onClick={handleUpdate }>
          Actualizar
        </button>
        <button className="menu-sidebar" onClick={handleClean}>
          Limpiar
        </button>
        <button className="menu-sidebar" onClick={handleNew}>
          Nuevo
        </button>
        <button className="menu-sidebar" onClick={handleSubmit}>
          Guardar
        </button>
      </div>
      <div className="form-content">
        <div className="frame list-view">
          <table>
            <thead>
              <tr>
                <th>Finca</th>
                <th>Número de Hectáreas</th>
                <th>Ubicación</th>
                <th>Propietario</th>
                <th>Dron</th>
                <th>Fecha Inicial</th>
                <th>Duración</th>
                <th>Fecha Final</th>
                <th>Estado</th>
                <th>Días Completados</th>
                <th>Hectáreas Terminadas</th>
                <th>Fecha (Avance)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fincas.map((finca) => (
                <tr key={finca.id} onClick={() => handleRowClick(finca)}>
                  <td>{finca.nombre}</td>
                  <td>{finca.total_hectareas}</td>
                  <td>{finca.ubicacion}</td>
                  <td>{finca.persona_nombre_completo}</td>
                  <td>{finca.dron_nombre}</td>
                  <td>{finca.trabajos?.map((trabajo) => trabajo.fecha_inicio).join(", ")}</td>
                  <td>{finca.trabajos?.map((trabajo) => trabajo.duracion).join(", ")}</td>
                  <td>{finca.trabajos?.map((trabajo) => trabajo.fecha_final).join(", ")}</td>
                  <td>{finca.trabajos?.map((trabajo) => trabajo.estado).join(", ")}</td>
                  <td>{finca.trabajos?.flatMap((trabajo) => trabajo.avances?.map((avance) => avance.dias_completados)).join(", ")}</td>
                  <td>{finca.trabajos?.flatMap((trabajo) => trabajo.avances?.map((avance) => avance.hectareas_terminadas)).join(", ")}</td>
                  <td>{finca.trabajos?.flatMap((trabajo) => trabajo.avances?.map((avance) => avance.fecha)).join(", ")}</td>
                  <td>
                    <button onClick={() => handleDelete(finca.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="frame">
          <form className="form-grid" onSubmit={handleSubmit}>
            {Object.keys(form)
      
              .map((key) => (
                <div className="form-group" key={key}>
                  <label>{key.replace(/_/g, " ")}</label>
                  <input
                    type={key.includes("Fecha") ? "date" : "text"}
                    name={key}
                    id={key === "Nombre" ? "Nombre" : undefined}
                    value={form[key]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            <div className="form-group"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;