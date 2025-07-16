
import React, { useState, useEffect } from "react";
// Axios para hacer solicitudes HTTP al backend
import axios from "axios";
// Componente de interfaz visual del formulario de programación
import ProgramacionForm from "../components/ProgramacionForm";
// Importación de estilos CSS
import "../styles/index.css";


// Estado para almacenar la lista de fincas y los datos del formulario
const ProgramacionPage = () => {
  const [fincas, setFincas] = useState([]);
  const [form, setForm] = useState({
    Finca: "",
    Area: "",
    Fecha_Programacion: "",
    Fecha_Ejecucion: "",
    Dron: "",
    Corte_Facturacion: "",
    Mes: "",
    Precio: "",
    Total_Factura: "",
    Cliente: "",
    Factura: "",
  });

  // Al montar el componente, obtenemos las fincas existentes desde el backend
  useEffect(() => {
    fetchFincas();
  }, []);

  // Función para obtener los datos desde el backend
  const fetchFincas = async () => {
    try {
      const response = await axios.get("http://localhost:5000/programacion/programaciones");
      setFincas(response.data);
    } catch (error) {
      console.error("Error al obtener las programaciones:", error);
    }
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [name]: value,
      };
  
      // Calcula Total_Factura si cambia Precio o Area
      const area = name === "Area" ? parseFloat(value) : parseFloat(prevForm.Area);
      const precio = name === "Precio" ? parseFloat(value) : parseFloat(prevForm.Precio);
  
      if (!isNaN(area) && !isNaN(precio)) {
        updatedForm.Total_Factura = (area * precio).toFixed(2);
      }
  
      return updatedForm;
    });
  };
  

  // Función para insertar datos nuevos en todas las tablas relacionadas con formulario2
  const handleSubmit = async (e) => {
    e.preventDefault();

    const origen = "formulario2";
    try {
      // Separamos nombres completo en nombres y apellidos
      const nombreArray = form.Cliente.trim().split(" ");
      const nombres = nombreArray.slice(0, -1).join(" ") || form.Cliente;
      const apellidos = nombreArray.slice(-1).join(" ") || "";

      // Creamos una persona
      const personaResponse = await axios.post("http://localhost:5000/programacion/personas", {
        nombres,
        apellidos,
        origen,
      });

      // Creamos un dron
      const dronResponse = await axios.post("http://localhost:5000/programacion/dron", {
        nombre: form.Dron,
        origen,
      });

      // Creamos una finca asociada a la persona y al dron
      const fincaResponse = await axios.post("http://localhost:5000/programacion/finca", {
        nombre: form.Finca,
        area: form.Area,
        origen,
        fk_persona: personaResponse.data.id,
        fk_dron: dronResponse.data.id,
      });
      
      // Creamos una factura
      const facturaResponse = await axios.post("http://localhost:5000/programacion/factura", {
        corte_facturacion: form.Corte_Facturacion,
        precio: form.Precio,
        total_factura: form.Total_Factura,
        codigo_factura: form.Factura,
        origen,
      });

      // Creamos un trabajo asociado a la finca y a la factura
      const trabajoResponse = await axios.post("http://localhost:5000/programacion/trabajo", {
        fecha_inicio: form.Fecha_Programacion,
        fecha_final: form.Fecha_Ejecucion,
        origen,
        fk_finca: fincaResponse.data.id,
        fk_factura: facturaResponse.data.id,
      });

      // Creamos un avance asociado al trabajo
      const avanceResponse = await axios.post("http://localhost:5000/programacion/avance", {
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
  const handleUpdate = async () => {
    try {
      if (!form.fk_finca) {
        alert("Error: No hay una finca seleccionada para actualizar.");
        return;
      }

      const origen = "formulario2";

      await axios.put(`http://localhost:5000/programacion/finca/${form.fk_finca}`, {
        nombre: form.Finca,
        area: form.Area,
        origen,
        fk_persona: form.fk_persona,
        fk_dron: form.fk_dron,
      });

      if (form.fk_persona && form.Cliente.trim() !== "") {
        const nombreArray = form.Cliente.trim().split(" ");
        const nombres = nombreArray.slice(0, -1).join(" ") || form.Cliente;
        const apellidos = nombreArray.length > 1 ? nombreArray.slice(-1).join(" ") : "";

        await axios.put(`http://localhost:5000/programacion/personas/${form.fk_persona}`, {
          nombres: nombres || "Desconocido",
          apellidos,
          origen,
        });
      }

      if (form.fk_dron) {
        await axios.put(`http://localhost:5000/programacion/dron/${form.fk_dron}`, {
          nombre: form.Dron,
          origen,
        });
      }

      if (form.fk_trabajo) {
        await axios.put(`http://localhost:5000/programacion/trabajo/${form.fk_trabajo}`, {
          fecha_inicio: form.Fecha_Programacion,
          fecha_final: form.Fecha_Ejecucion,
          origen,
          fk_finca: form.fk_finca,
          fk_factura: form.fk_factura,
        });
      }

      if (form.fk_factura) {
        await axios.put(`http://localhost:5000/programacion/factura/${form.fk_factura}`, {
          corte_facturacion: form.Corte_Facturacion,
          precio: form.Precio,
          total_factura: form.Total_Factura,
          codigo_factura: form.Factura,
          origen,
        });
      }

      if (form.fk_avance) {
        await axios.put(`http://localhost:5000/programacion/avance/${form.fk_avance}`, {
          mes:form.Mes,
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
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta programación?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/programacion/programaciones/relacionada/${id}`);
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
      Finca: finca.finca_nombre,
      Area: finca.area,
      fk_persona: finca.fk_persona,
      Cliente: finca.persona_nombre_completo,
      fk_dron: finca.fk_dron,
      Dron: finca.dron_nombre,
      fk_trabajo: finca.trabajos?.[0]?.id || "",
      Fecha_Programacion: finca.trabajos?.[0]?.fecha_inicio || "",
      Fecha_Ejecucion: finca.trabajos?.[0]?.fecha_final || "",
      fk_avance:finca.trabajos?.[0]?.avances?.[0]?.id || "",
      Mes: finca.trabajos?.[0]?.avances?.[0]?.avance_mes || "",
      fk_factura: finca.trabajos?.[0]?.fk_factura || "",
      Corte_Facturacion: finca.trabajos?.[0]?.corte_facturacion || "",
      Precio: finca.trabajos?.[0]?.precio || "",
      Total_Factura: finca.trabajos?.[0]?.total_factura || "",
      Factura: finca.trabajos?.[0]?.codigo_factura || "",
    });

  };

  // Función para limpiar el formulario y genera un enfoque en el campo "Finca"
  const handleNew = () => {
    setForm({
      Finca: "",
      Area: "",
      Fecha_Programacion: "",
      Fecha_Ejecucion: "",
      Dron: "",
      Corte_Facturacion: "",
      Mes: "",
      Precio: "",
      Total_Factura: "",
      Cliente: "",
      Factura: "",
    });

    setTimeout(() => {
      document.getElementById("Finca")?.focus();
    }, 100);
  };

  
  // Función para limpiar el formulario
  const handleClean = () => {
    handleNew();
  };

  // Renderiza el componente ProgramacionForm con las propiedades necesarias
  return (
    <ProgramacionForm
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

// Exporta el componente ProgramacionPage
export default ProgramacionPage;
