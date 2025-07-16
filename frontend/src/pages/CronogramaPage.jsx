import React, { useState, useEffect } from "react";
// Axios para hacer solicitudes HTTP al backend
import axios from "axios";
// Componente de interfaz visual del formulario de cronograma
import Interfaz from "../components/Cronograma";
// Importación de estilos CSS
import "../styles/index.css";


// Estado para almacenar la lista de fincas y los datos del formulario
const CronogramaPage = () => {
  const [fincas, setFincas] = useState([]);
  const [form, setForm] = useState({
    Finca: "",
    Propietario: "",
    Fecha_Inicial: "",
    Fecha_Final: "",
    Duracion: "",
    Progreso: "",
    Dias_Completados: "",
    Hectareas_Terminadas: "",
    Avance: "",
    Mes: "",
  });


  // Al montar el componente, obtenemos las fincas existentes desde el backend
  useEffect(() => {
    fetchFincas();
  }, []);

  // Función para obtener los datos desde el backend
  const fetchFincas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/todo");
      setFincas(response.data);
    } catch (error) {
      console.error("Error fetching fincas:", error);
    }
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Función para insertar datos nuevos en todas las tablas relacionadas con formulario1
  const handleSubmit = async (e) => {
    e.preventDefault();

    const origen = "formulario1";

    try {

      // Separamos nombres completo en nombres y apellidos
      const nombreArray = form.Propietario.trim().split(" ");
      const nombres = nombreArray.slice(0, -1).join(" ") || form.Propietario;
      const apellidos = nombreArray.slice(-1).join(" ") || "";

      // Creamos una persona
      const personaResponse = await axios.post("http://localhost:5000/persona", {
        nombres,
        apellidos,
        origen,
      });

      // Creamos una finca asociada a la persona
      const fincaResponse = await axios.post("http://localhost:5000/finca", {
        nombre: form.Finca,
        origen,
        fk_persona: personaResponse.data.id,
      });

      // Creamos un trabajo asociado a la finca
      const trabajoResponse = await axios.post("http://localhost:5000/trabajo", {
        fecha_inicio: form.Fecha_Inicial,
        fecha_final: form.Fecha_Final,
        duracion: form.Duracion,
        progreso: form.Progreso,
        avance_total: form.Avance,
        origen,
        fk_finca: fincaResponse.data.id,
      });

      // Creamos un avance asociado al trabajo
      await axios.post("http://localhost:5000/avance", {
        dias_completados: form.Dias_Completados,
        hectareas_terminadas: form.Hectareas_Terminadas,
        mes: form.Mes,
        origen,
        fk_trabajo: trabajoResponse.data.id,
      });

      fetchFincas();
      handleClean();
    } catch (error) {
      console.error("Error creando registros:", error);
    }
  };

  // Función para actualizar los datos del formulario
  const handleUpdate = async (e) => {
    e.preventDefault();

    const origen = "formulario1";

    try {
      if (!form.fk_finca) {
        alert("Error: No hay una finca seleccionada para actualizar.");
        return;
      }

      // Actualizamos una finca
      await axios.put(`http://localhost:5000/finca/${form.fk_finca}`, {
        nombre: form.Finca,
        origen,
        fk_persona: form.fk_persona || null,
      });

      // Si hay un propietario, actualizamos la persona asociada
      if (form.fk_persona && form.Propietario.trim() !== "") {
        const nombreArray = form.Propietario.trim().split(" ");
        const nombres = nombreArray.slice(0, -1).join(" ") || form.Propietario;
        const apellidos = nombreArray.length > 1 ? nombreArray.slice(-1).join(" ") : "";

        await axios.put(`http://localhost:5000/persona/${form.fk_persona}`, {
          nombres: nombres || "Desconocido",
          apellidos,
          origen,
        });
      }

      // Actualizamos el trabajo asociado a la finca
      if (form.fk_trabajo) {
        await axios.put(`http://localhost:5000/trabajo/${form.fk_trabajo}`, {
          fecha_inicio: form.Fecha_Inicial,
          fecha_final: form.Fecha_Final,
          duracion: form.Duracion,
          progreso: form.Progreso,
          avance_total: form.Avance,
          origen,
          fk_finca: form.fk_finca,
        });
      }

      // Actualizamos el avance asociado al trabajo
      if (form.fk_avance) {
        await axios.put(`http://localhost:5000/avance/${form.fk_avance}`, {
          dias_completados: form.Dias_Completados,
          hectareas_terminadas: form.Hectareas_Terminadas,
          mes: form.Mes,
          origen,
          fk_trabajo: form.fk_trabajo,
        });
      }

      alert("Datos actualizados correctamente");
      fetchFincas();
    } catch (error) {
      console.error("Error actualizando los datos:", error);
      alert("Hubo un error al actualizar los datos.");
    }
  };

  // Función para eliminar una finca y sus datos relacionados
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta finca y todos sus datos relacionados?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/relaciones/${id}`);
      alert("Finca eliminada correctamente");
      fetchFincas();
    } catch (error) {
      console.error("Error eliminando la finca:", error);
      alert("Hubo un error al eliminar la finca.");
    }
  };

  // Carga los datos de un registro seleccionado en el formulario
  const handleRowClick = (finca) => {
    setForm({
      fk_finca: finca.id,
      Finca: finca.nombre,
      fk_persona: finca.fk_persona,
      Propietario: finca.persona_nombre_completo,
      fk_trabajo: finca.trabajos?.[0]?.id || "",
      Fecha_Inicial: finca.trabajos?.[0]?.fecha_inicio || "",
      Fecha_Final: finca.trabajos?.[0]?.fecha_final || "",
      Duracion: finca.trabajos?.[0]?.duracion || "",
      Progreso: finca.trabajos?.[0]?.progreso || "",
      Avance: finca.trabajos?.[0]?.avance_total || "",
      fk_avance: finca.trabajos?.[0]?.avances?.[0]?.id || "",
      Dias_Completados: finca.trabajos?.[0]?.avances?.[0]?.dias_completados || "",
      Hectareas_Terminadas: finca.trabajos?.[0]?.avances?.[0]?.hectareas_terminadas || "",
      Mes: finca.trabajos?.[0]?.avances?.[0]?.mes || "",
    });
  };

  // Función para limpiar el formulario y genera un enfoque en el campo "Finca"
  const handleNew = () => {
    setForm({
      Finca: "",
      Propietario: "",
      Fecha_Inicial: "",
      Fecha_Final: "",
      Duracion: "",
      Progreso: "",
      Dias_Completados: "",
      Hectareas_Terminadas: "",
      Avance: "",
      Mes: "",
    });

    setTimeout(() => {
      document.getElementById("Finca")?.focus();
    }, 100);
  };

  // Función para limpiar el formulario
  const handleClean = () => {
    setForm({
      Finca: "",
      Propietario: "",
      Fecha_Inicial: "",
      Fecha_Final: "",
      Duracion: "",
      Progreso: "",
      Dias_Completados: "",
      Hectareas_Terminadas: "",
      Avance: "",
      Mes: "",
    });
  };

  // Renderiza el componente Cronograma con las propiedades necesarias
  return (
    <Interfaz
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      handleRowClick={handleRowClick}
      handleNew={handleNew}
      handleClean={handleClean}
      fincas={fincas}
    />
  );
};

// Exporta el componente CronogramaPage
export default CronogramaPage;
