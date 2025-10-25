import React from "react";
import "../styles/Ayuda.css";
import { FaBook } from "react-icons/fa";

const documentos = [
  "Manual de usuario",
  "Documentacion/Informe tecnico",
];

const Ayuda = () => {
  return (
    <div className="ayuda-container">
      <h1 className="titulo">Ayuda</h1>
      <p className="descripcion">
        Apoyo para el uso del aplicativo, tutoriales, documentación y video
      </p>

      {/* Video embebido */}
      <div className="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Tutorial"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Documentos */}
      <div className="lista-documentos">
        {documentos.map((doc, index) => (
          <div key={index} className="item-doc">
            <div className="icono-texto">
              <FaBook className="icono" />
              <span>{doc}</span>
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

export default Ayuda;
