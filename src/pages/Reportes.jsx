// reportes.jsx
import React from "react";
import TablaCategoria from '../components/common/TablaCategoria';
import { useFilter } from "../context/FilterContext";
import {
  categorias_laboratorios,
  categorias_signos_vitales,
  categorias_sociodemograficas
} from "../data/filters";
import * as XLSX from "xlsx";
import "../styles/Tabla.css";
import "../styles/Reportes.css";

const Reportes = () => {
  const { selecciones, setSelecciones } = useFilter();

  const manejarSeleccion = (categoria, items) => {
    setSelecciones((prev) => ({ ...prev, [categoria]: items }));
  };

  const generarReporte = () => {
    const datos = [];
    for (const [categoria, items] of Object.entries(selecciones)) {
      items.forEach((item) => {
        datos.push({ Categoria: categoria, Resultado: item });
      });
    }

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "reporte.xlsx");
  };

  return (
    <div className="reportes-content">
      <h1>Reportes</h1>
      <div className="cards-container">
        <section className="laboratorio-card">
          <h2>Laboratorio</h2>
          {Object.entries(categorias_laboratorios).map(([nombre, datos]) => (
            <TablaCategoria
              key={nombre}
              titulo={nombre}
              datos={datos}
              onChange={manejarSeleccion}
              preSeleccionados={selecciones[nombre] || []}
            />
          ))}
        </section>

        <section className="laboratorio-card">
          <h2>Clinicas</h2>
          {Object.entries(categorias_signos_vitales).map(([nombre, datos]) => (
            <TablaCategoria
              key={nombre}
              titulo={nombre}
              datos={datos}
              onChange={manejarSeleccion}
              preSeleccionados={selecciones[nombre] || []}
            />
          ))}
        </section>
        <section className="laboratorio-card">
          <h2>Sociodemografica</h2>
          {Object.entries(categorias_sociodemograficas).map(([nombre, datos]) => (
            <TablaCategoria
              key={nombre}
              titulo={nombre}
              datos={datos}
              onChange={manejarSeleccion}
              preSeleccionados={selecciones[nombre] || []}
            />
          ))}
        </section>
      </div>
      <button className="btn" onClick={generarReporte}>
        Generar reporte Excel
      </button>
    </div>
  );
};

export default Reportes;
