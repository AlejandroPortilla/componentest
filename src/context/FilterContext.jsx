import React, { createContext, useContext, useState, useEffect } from 'react';

const FilterContext = createContext();

export const useFilter = () => {
  return useContext(FilterContext);
};

export const FilterProvider = ({ children }) => {
  const [selecciones, setSelecciones] = useState(() => {
    const saved = localStorage.getItem('selecciones');
    return saved ? JSON.parse(saved) : {};
  });
  const [historial, setHistorial] = useState(() => {
    const saved = localStorage.getItem('historial');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('selecciones', JSON.stringify(selecciones));
  }, [selecciones]);

  useEffect(() => {
    localStorage.setItem('historial', JSON.stringify(historial));
  }, [historial]);

  const guardarHistorial = (seleccionesActuales) => {
    const nuevaEntrada = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      filtros: { ...seleccionesActuales }
    };
    setHistorial(prev => [nuevaEntrada, ...prev.slice(0, 9)]); // Mantener solo las últimas 10 entradas
  };

  const cargarHistorial = (id) => {
    const entrada = historial.find(h => h.id === id);
    if (entrada) {
      setSelecciones(entrada.filtros);
    }
  };

  return (
    <FilterContext.Provider value={{
      selecciones,
      setSelecciones,
      historial,
      guardarHistorial,
      cargarHistorial
    }}>
      {children}
    </FilterContext.Provider>
  );
};
