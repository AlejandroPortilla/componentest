// TablaCategoria.jsx
import { useState, useEffect } from "react";

export default function TablaCategoria({ titulo, datos, onChange, preSeleccionados = [], mode = 'table', searchable = false }) {
  const [seleccionados, setSeleccionados] = useState(preSeleccionados);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setSeleccionados(preSeleccionados);
  }, [preSeleccionados]);

  useEffect(() => {
    // If parent clears data, ensure local state sync
    if (!preSeleccionados || preSeleccionados.length === 0) {
      setSeleccionados([]);
    }
  }, [datos]);

  const toggleSeleccion = (item) => {
    let nuevos;
    if (seleccionados.includes(item)) {
      nuevos = seleccionados.filter((i) => i !== item);
    } else {
      nuevos = [...seleccionados, item];
    }
    setSeleccionados(nuevos);
    onChange(titulo, nuevos);
  };

  const toggleSeleccionarTodo = () => {
    let nuevos;
    if (seleccionados.length === datos.length) {
      nuevos = [];
    } else {
      nuevos = [...datos];
    }
    setSeleccionados(nuevos);
    onChange(titulo, nuevos);
  };

  const datosFiltrados = datos.filter(d => d.toLowerCase().includes(filter.toLowerCase()));

  if (mode === 'grid') {
    return (
      <div className="categoria-grid">
        <div className="categoria-grid-header">
          <div className="categoria-title">{titulo}</div>
          <div className="categoria-actions">
            {searchable && (
              <input
                aria-label={`Buscar en ${titulo}`}
                placeholder="Buscar..."
                className="categoria-search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            )}
            <label className="select-all">
              <input
                type="checkbox"
                checked={seleccionados.length === datos.length}
                onChange={toggleSeleccionarTodo}
              />
              <span className="select-all-label">Todo</span>
            </label>
          </div>
        </div>

        <div className="grid-items">
          {datosFiltrados.map((item, idx) => {
            const sel = seleccionados.includes(item);
            return (
              <button key={idx} className={`categoria-chip ${sel ? 'selected' : ''}`} onClick={() => toggleSeleccion(item)}>
                <input
                  type="checkbox"
                  checked={sel}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSeleccion(item);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="chip-label">{item}</span>
              </button>
            );
          })}
          {datosFiltrados.length === 0 && (
            <div className="no-items">No hay resultados</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <table className="categoria-table">
      <thead>
        <tr>
          <th className="tabla-header-text">{titulo}</th>
          <th className="tabla-header-checkbox">
            <input
              type="checkbox"
              checked={seleccionados.length === datos.length}
              onChange={toggleSeleccionarTodo}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {datos.map((item, index) => (
          <tr
            key={index}
            onClick={() => toggleSeleccion(item)}
            className={`tabla-row ${seleccionados.includes(item) ? "selected" : ""}`}
          >
            <td className="tabla-cell-text">{item}</td>
            <td className="tabla-cell-checkbox">
              <input
                type="checkbox"
                checked={seleccionados.includes(item)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSeleccion(item);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
