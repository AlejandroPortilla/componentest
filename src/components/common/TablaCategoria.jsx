// TablaCategoria.jsx
import { useState, useEffect } from "react";

export default function TablaCategoria({ titulo, datos, onChange, preSeleccionados = [] }) {
  const [seleccionados, setSeleccionados] = useState(preSeleccionados);

  useEffect(() => {
    setSeleccionados(preSeleccionados);
  }, [preSeleccionados]);

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
