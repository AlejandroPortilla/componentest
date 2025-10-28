import React, { useState, useEffect } from 'react';
import TablaCategoria from '../components/common/TablaCategoria';
import { useFilter } from '../context/FilterContext';
import {
  categorias_laboratorios,
  categorias_signos_vitales,
  categorias_sociodemograficas
} from '../data/filters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, LabelList } from 'recharts';
import html2canvas from 'html2canvas';
import "../styles/Tabla.css";
import "../styles/Reportes.css";

// Unified color palette for charts and annotations
const CHART_COLORS = ['#2b6cb0', '#38b2ac', '#81c2ff', '#ffd080', '#7b8bf6', '#82ca9d', '#ffc658', '#ff7c7c'];

// Helper function to calculate days between dates
const calculateDaysBetween = (start, end) => {
  if (!start || !end) return 1;
  const diffTime = Math.abs(new Date(end) - new Date(start));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

// Mapeo de subcategorías a categorías principales
const categoriaPrincipalMap = {
  ...Object.keys(categorias_laboratorios).reduce((acc, key) => ({ ...acc, [key]: 'Laboratorio' }), {}),
  ...Object.keys(categorias_signos_vitales).reduce((acc, key) => ({ ...acc, [key]: 'Clinicas' }), {}),
  ...Object.keys(categorias_sociodemograficas).reduce((acc, key) => ({ ...acc, [key]: 'Sociodemografica' }), {}),
};

// Función para renderizar gráfico
const renderChart = (data, chartType) => {
  switch (chartType) {
    case 'pie': {
      // compact pie settings: smaller radii, percentage-only labels, spaced slices
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            // show only percentage inside slices to avoid overflow
            label={({ percent }) => `${Math.round(percent * 100)}%`}
            outerRadius={60}
            innerRadius={30}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
        </PieChart>
      );
    }
    case 'line': {
      return (
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={data.length > 4 ? -35 : -10}
            textAnchor={data.length > 4 ? "end" : "middle"}
            height={data.length > 4 ? 90 : 60}
            interval={0}
            tick={{ fontSize: 12, fill: '#334155' }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2.2} dot={{ r: 3 }} activeDot={{ r: 5 }}>
            <LabelList dataKey="value" position="top" />
          </Line>
        </LineChart>
      );
    }

    default:
      return (
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 40 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#334155' }}
            interval={0}
            angle={data.length > 4 ? -35 : 0}
            textAnchor={data.length > 4 ? "end" : "middle"}
            height={data.length > 4 ? 80 : 50}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid rgba(2,6,23,0.06)',
              borderRadius: '6px',
              fontSize: '13px'
            }}
          />
          <Bar
            dataKey="value"
            fill={CHART_COLORS[1]}
            radius={[6, 6, 4, 4]}
            barSize={Math.max(40, Math.min(100, Math.floor(600 / Math.max(1, data.length))))}
          >
            <LabelList dataKey="value" position="top" />
          </Bar>
        </BarChart>
      );
  }
};

const Dashboard = () => {
  const { selecciones, setSelecciones, guardarHistorial } = useFilter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartTypes, setChartTypes] = useState({});
  const [generalChartType, setGeneralChartType] = useState('bar');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // prevent background scrolling when modal is open
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const manejarSeleccion = (categoria, items) => {
    setSelecciones((prev) => ({ ...prev, [categoria]: items }));
  };

  const cambiarTipoGrafico = (categoria, tipo) => {
    setChartTypes((prev) => ({ ...prev, [categoria]: tipo }));
  };

  const descargarGrafico = async (categoria) => {
    const chartElement = document.getElementById(`chart-${categoria}`);
    if (chartElement) {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        width: chartElement.offsetWidth,
        height: chartElement.offsetHeight
      });
      const link = document.createElement('a');
      link.download = `${categoria}-grafico.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

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
    <div className="dashboard-content">

      <div className="card">
        <h2>Dashboard Principal</h2>
        <p>Presiona el Boton "filtros para graficos" para empezar a graficar.</p>
        <p>Para generar el reporte en excel Presiona el boton "filtros para graficos" selecciona los que requieras
          y presiona "Aplicar en reportes".</p>
      </div>

      {/* Date filters */}
      <div className="date-filters-section">
        <h3>Filtros de Fecha</h3>
        <div className="date-filters">
          <label className="date-label">
            Fecha de inicio:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </label>
          <label className="date-label">
            Fecha de fin:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </label>
        </div>
      </div>

      <button className="btn" onClick={() => setIsModalOpen(true)}>
        Filtros para graficos
      </button>

      {/* New section for general cases and summary */}
      {startDate && endDate && (
        <div className="charts-container">
          <h2>Casos Reportados en General</h2>
          {(() => {
            let chartData = [];
            let title = 'Casos Reportados en General';

            // Generate time series data based on date range
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = calculateDaysBetween(startDate, endDate);
            chartData = [];
            for (let i = 0; i < days; i++) {
              const date = new Date(start);
              date.setDate(start.getDate() + i);
              const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
              chartData.push({
                name: dateStr,
                value: 20 + i * 5 // Sample increasing values for demonstration
              });
            }
            title = `Casos Reportados en General (${days} días)`;

            return (
              <div className="general-cases-section">
                <div className="general-cases-right">
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>{title}</h3>
                      <div className="chart-controls">
                        <button className="chart-btn" onClick={() => setGeneralChartType('bar')}>Barras</button>
                        {chartData.length > 1 && <button className="chart-btn" onClick={() => setGeneralChartType('pie')}>Pastel</button>}
                        {chartData.length > 1 && <button className="chart-btn" onClick={() => setGeneralChartType('line')}>Línea</button>}
                        <button className="chart-btn download-btn" onClick={() => descargarGrafico('general-cases')}>📷 Descargar</button>
                      </div>
                    </div>

                    <div id="chart-general-cases" className="chart-content">
                      <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={360}>
                          {renderChart(chartData, generalChartType)}
                        </ResponsiveContainer>
                      </div>
                      {generalChartType === 'pie' && (() => {
                        const total = chartData.reduce((sum, d) => sum + (d.value || 0), 0);
                        return (
                          <div className="chart-annotations">
                            <ul className="pie-legend-list">
                              {chartData.map((d, idx) => {
                                const pct = total ? Math.round(((d.value || 0) * 100) / total) : 0;
                                return (
                                  <li key={d.name || idx} className="pie-legend-item">
                                    <span className={`pie-legend-dot color-dot-${idx % CHART_COLORS.length}`} />
                                    <span className="pie-legend-text">{d.name}</span>
                                    <span className="pie-legend-value">{pct}%</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                </div>
              </div>


            );
          })()}
        </div>
      )}

      {/* Gráficos separados por categoría principal */}
      {Object.keys(selecciones).length > 0 && Object.values(selecciones).some(items => items.length > 0) && (
        <div className="charts-container">
          <div className="category-charts-container">
            {(() => {
              const categoriasPrincipales = ['Sociodemografica', 'Laboratorio', 'Clinicas'];
              return categoriasPrincipales.map((categoriaPrincipal) => {
                // Filtrar selecciones que pertenecen a esta categoría principal
                const seleccionesCategoria = Object.entries(selecciones).filter(([subcategoria]) =>
                  categoriaPrincipalMap[subcategoria] === categoriaPrincipal
                );

                const hasSelections = seleccionesCategoria.length > 0 && seleccionesCategoria.some(([_, items]) => items.length > 0);

                return (
                  <div key={categoriaPrincipal} className="category-section">
                    <div className="chart-card category-chart">
                      <div className="chart-header">
                        <h3>{categoriaPrincipal}</h3>
                      </div>
                      {hasSelections ? (
                        (categoriaPrincipal === 'Clinicas' || categoriaPrincipal === 'Laboratorio') ? (
                          // Para Clinicas, mostrar todas las subcategorías en un solo contenedor
                          <div className="clinicas-container">
                            {seleccionesCategoria.map(([subcategoria, items]) => {
                              if (items.length === 0) return null;
                              const subcategoriaData = items.map((item) => ({
                                name: item,
                                value: Math.floor(Math.random() * 100) + 1,
                                subcategory: subcategoria
                              }));
                              const currentType = chartTypes[`${categoriaPrincipal}-${subcategoria}`] || 'bar';
                              return (
                                <div key={`${categoriaPrincipal}-${subcategoria}`} className="subcategory-chart">
                                  <div className="chart-header">
                                    <h4>{subcategoria}</h4>
                                    <div className="chart-controls">
                                      <button className="chart-btn" onClick={() => cambiarTipoGrafico(`${categoriaPrincipal}-${subcategoria}`, 'bar')}>Barras</button>
                                      {subcategoriaData.length > 1 && <button className="chart-btn" onClick={() => cambiarTipoGrafico(`${categoriaPrincipal}-${subcategoria}`, 'pie')}>Pastel</button>}
                                      {subcategoriaData.length > 1 && <button className="chart-btn" onClick={() => cambiarTipoGrafico(`${categoriaPrincipal}-${subcategoria}`, 'line')}>Línea</button>}
                                      <button className="chart-btn download-btn" onClick={() => descargarGrafico(`${categoriaPrincipal}-${subcategoria}`)}>📷 Descargar</button>
                                    </div>
                                  </div>
                                  <div id={`chart-${categoriaPrincipal}-${subcategoria}`} className="chart-content">
                                    <div className="chart-wrapper">
                                      <ResponsiveContainer width="100%" height={300}>
                                        {renderChart(subcategoriaData, currentType)}
                                      </ResponsiveContainer>
                                    </div>
                                    {currentType === 'pie' && (() => {
                                      const total = subcategoriaData.reduce((sum, d) => sum + (d.value || 0), 0);
                                      return (
                                        <div className="chart-annotations">
                                          <ul className="pie-legend-list">
                                            {subcategoriaData.map((d, idx) => {
                                              const pct = total ? Math.round(((d.value || 0) * 100) / total) : 0;
                                              return (
                                                <li key={d.name || idx} className="pie-legend-item">
                                                  <span className={`pie-legend-dot color-dot-${idx % CHART_COLORS.length}`} />
                                                  <span className="pie-legend-text">{d.name}</span>
                                                  <span className="pie-legend-value">{pct}%</span>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : categoriaPrincipal === 'Sociodemografica' ? (
                          // Para Sociodemografica, mostrar todos los items en un solo contenedor
                          <div className="sociodemografica-container">
                            {(() => {
                              const allItems = [];
                              seleccionesCategoria.forEach(([subcategoria, items]) => {
                                items.forEach((item) => {
                                  allItems.push({ item, subcategoria });
                                });
                              });
                              // Agrupar items relacionados (fecha de ingreso y egreso)
                              const groupedItems = allItems.reduce((acc, { item, subcategoria }) => {
                                if (item.toLowerCase().includes('fecha')) {
                                  if (!acc.fechas) acc.fechas = [];
                                  acc.fechas.push({ item, subcategoria });
                                } else {
                                  if (!acc.otros) acc.otros = [];
                                  acc.otros.push({ item, subcategoria });
                                }
                                return acc;
                              }, {});

                              const renderItemChart = ({ item, subcategoria }) => {
                                const itemData = [{
                                  name: item,
                                  value: Math.floor(Math.random() * 100) + 1,
                                  subcategory: subcategoria
                                }];
                                const currentType = chartTypes[`${categoriaPrincipal}-${item}`] || 'bar';
                                return (
                                  <div key={`${categoriaPrincipal}-${item}`} className="item-chart">
                                    <div className="chart-header">
                                      <h4>{item}</h4>
                                      <div className="chart-controls">
                                        <button className="chart-btn" onClick={() => cambiarTipoGrafico(`${categoriaPrincipal}-${item}`, 'bar')}>Barras</button>
                                        {itemData.length > 1 && <button className="chart-btn" onClick={() => cambiarTipoGrafico(`${categoriaPrincipal}-${item}`, 'pie')}>Pastel</button>}
                                        {itemData.length > 1 && <button className="chart-btn" onClick={() => cambiarTipoGrafico(`${categoriaPrincipal}-${item}`, 'line')}>Línea</button>}
                                        <button className="chart-btn download-btn" onClick={() => descargarGrafico(`${categoriaPrincipal}-${item}`)}>📷 Descargar</button>
                                      </div>
                                    </div>
                                    <div id={`chart-${categoriaPrincipal}-${item}`} className="chart-content">
                                      <div className="chart-wrapper">
                                        <ResponsiveContainer width="100%" height={300}>
                                          {renderChart(itemData, currentType)}
                                        </ResponsiveContainer>
                                      </div>
                                      {currentType === 'pie' && (() => {
                                        const total = itemData.reduce((sum, d) => sum + (d.value || 0), 0);
                                        return (
                                          <div className="chart-annotations">
                                            <ul className="pie-legend-list">
                                              {itemData.map((d, idx) => {
                                                const pct = total ? Math.round(((d.value || 0) * 100) / total) : 0;
                                                return (
                                                  <li key={d.name || idx} className="pie-legend-item">
                                                    <span className={`pie-legend-dot color-dot-${idx % CHART_COLORS.length}`} />
                                                    <span className="pie-legend-text">{d.name}</span>
                                                    <span className="pie-legend-value">{pct}%</span>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                );
                              };

                              return (
                                <>
                                  {groupedItems.fechas && groupedItems.fechas.length > 0 && (
                                    <div className="fecha-group">
                                      <h4>Fechas</h4>
                                      <div className="fecha-charts">
                                        {groupedItems.fechas.map(renderItemChart)}
                                      </div>
                                    </div>
                                  )}
                                  {groupedItems.otros && groupedItems.otros.map(renderItemChart)}
                                </>
                              );
                            })()}
                          </div>
                        ) : null
                      ) : (
                        <div className="no-selections">
                          <p>No hay selecciones para esta categoría. Usa el botón "Filtros para gráficos" para seleccionar items.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

              {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

              <div className="modal-header">
                <div className="modal-title">Filtros para Gráficos</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="modal-close" onClick={() => { guardarHistorial(selecciones); setIsModalOpen(false); window.location.href = '/reportes'; }}>Aplicar</button>
                  <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                </div>
              </div>

              <div className="modal-left">
                <input
                  type="text"
                  placeholder="Buscar filtros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="modal-search"
                />

                <div style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 15, margin: '6px 0' }}>Laboratorio</h3>
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
                    <h3 style={{ fontSize: 15, margin: '6px 0' }}>Clínicas</h3>
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
                    <h3 style={{ fontSize: 15, margin: '6px 0' }}>Sociodemografica</h3>
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
                </div>
              </div>

              <div className="modal-right">
                <div className="modal-selected-title">Seleccionados</div>
                <div className="selected-box">
                  {Object.entries(selecciones).flatMap(([cat, items]) => items.map((it) => ({ cat, it }))).length === 0 ? (
                    <div style={{ color: '#6c757d' }}>Ninguno</div>
                  ) : (
                    Object.entries(selecciones).flatMap(([cat, items]) => items.map((it) => ({ cat, it }))).map((s, idx) => (
                      <div key={idx} className="chip">{s.it} <button className="remove" onClick={() => {
                        const nuevos = (selecciones[s.cat] || []).filter(x => x !== s.it);
                        setSelecciones(prev => ({ ...prev, [s.cat]: nuevos }));
                      }}>✕</button></div>
                    ))
                  )}
                </div>

                <div className="modal-actions">
                  <button className="btn" onClick={() => { setSelecciones({}); }}>Limpiar</button>
                  <button className="btn" onClick={() => { guardarHistorial(selecciones); setIsModalOpen(false); window.location.href = '/reportes'; }}>Aplicar en Reportes</button>
                </div>

              </div>

            </div>
          </div>
        )}
          </div>
  );
};

export default Dashboard;
