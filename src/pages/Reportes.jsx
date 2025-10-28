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
  const [searchTerm, setSearchTerm] = React.useState('');

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

  const clearSelection = () => {
    setSelecciones({});
  };

  const allSelectedItems = Object.entries(selecciones).flatMap(([cat, items]) => items.map(it => ({ cat, it })));

  const filterCategories = (categories) => {
    return Object.fromEntries(
      Object.entries(categories).map(([key, arr]) => [
        key,
        arr.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      ]).filter(([key, arr]) => arr.length > 0)
    );
  };

  const filteredLaboratorios = filterCategories(categorias_laboratorios);
  const filteredSignos = filterCategories(categorias_signos_vitales);
  const filteredSociodemograficas = filterCategories(categorias_sociodemograficas);

  return (
    <div className="reportes-content">
      <h1>Reportes</h1>

      <div className="filters-top">
        <input className="global-search" placeholder="Buscar filtros..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <div className="chips-list-wrapper">
          <div style={{ fontSize: 13, color: '#6c757d' }}>Seleccionados</div>
          <div className="chips-list">
            {allSelectedItems.length === 0 ? <div style={{ color: '#6c757d' }}>Ninguno</div> : allSelectedItems.map((s, i) => (
              <div key={i} className="chip">{s.it} <button className="remove" onClick={() => {
                const nuevos = (selecciones[s.cat] || []).filter(x => x !== s.it);
                setSelecciones(prev => ({ ...prev, [s.cat]: nuevos }));
              }}>✕</button></div>
            ))}
          </div>
        </div>
      </div>

      <div className="cards-container">
        <div>
          <h2>Laboratorio</h2>
          {Object.entries(filteredLaboratorios).map(([nombre, datos]) => (
            <details key={nombre} className="reportes-accordion" open={Boolean(searchTerm)}>
              <summary>
                <span>{nombre}</span>
                <span className="details-count">{(selecciones[nombre] || []).length}</span>
              </summary>
              <div style={{ padding: 8 }}>
                <TablaCategoria
                  titulo={nombre}
                  datos={datos}
                  onChange={manejarSeleccion}
                  preSeleccionados={selecciones[nombre] || []}
                  mode="grid"
                  searchable={true}
                />
              </div>
            </details>
          ))}
        </div>

        <div>
          <h2>Clínicas</h2>
          {Object.entries(filteredSignos).map(([nombre, datos]) => (
            <details key={nombre} className="reportes-accordion" open={Boolean(searchTerm)}>
              <summary>
                <span>{nombre}</span>
                <span className="details-count">{(selecciones[nombre] || []).length}</span>
              </summary>
              <div style={{ padding: 8 }}>
                <TablaCategoria
                  titulo={nombre}
                  datos={datos}
                  onChange={manejarSeleccion}
                  preSeleccionados={selecciones[nombre] || []}
                  mode="grid"
                  searchable={true}
                />
              </div>
            </details>
          ))}
        </div>

        <div>
          <h2>Sociodemográfica</h2>
          {Object.entries(filteredSociodemograficas).map(([nombre, datos]) => (
            <details key={nombre} className="reportes-accordion" open={Boolean(searchTerm)}>
              <summary>
                <span>{nombre}</span>
                <span className="details-count">{(selecciones[nombre] || []).length}</span>
              </summary>
              <div style={{ padding: 8 }}>
                <TablaCategoria
                  titulo={nombre}
                  datos={datos}
                  onChange={manejarSeleccion}
                  preSeleccionados={selecciones[nombre] || []}
                  mode="grid"
                  searchable={true}
                />
              </div>
            </details>
          ))}
        </div>

        <div className="actions-row">
          <button className="btn" onClick={clearSelection}>Limpiar Selecciones</button>
          <button className="btn" onClick={generarReporte}>Exportar a Excel</button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
