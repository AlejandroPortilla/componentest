import React from "react";
import "../styles/Historial.css";
import { FaClock } from "react-icons/fa";

const registros = [
  "Registro del 23/01/2025",
  "Registro del 16/01/2025",
  "Registro del 09/01/2025",
  "Registro del 02/01/2025",
  "Registro del 26/12/2024",
  "Registro del 19/12/2024",
  "Registro del 12/12/2024",
  "Registro del 05/12/2024",
];

const Historial = () => {
  return (
    <div className="historial-container">
      <h1 className="titulo">Historiales</h1>
      <p className="descripcion">
        Registros previos de la base de datos.  
        <br />
        Se generará uno cada semana.
      </p>

      <div className="lista-historiales">
        {registros.map((registro, index) => (
          <div key={index} className="item-historial">
            <div className="icono-texto">
              <FaClock className="icono" />
              <span>{registro}</span>
            </div>
            <button className="btn-cargar">
              Cargar <span className="flecha">➔</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;
