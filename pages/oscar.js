import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function OscarDashboard() {
  return (
    <>
      <Head>
        <title>Dashboard Ejecutivo - BeautyTrack</title>
        <meta name="description" content="Dashboard de seguimiento de indicadores comerciales" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-purple-900">BeautyTrack</h1>
                <span className="text-sm text-gray-500">Dashboard Ejecutivo</span>
              </div>
              <div className="flex items-center space-x-4">
                <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
                  <option>Todas las sucursales (34)</option>
                  <option>Liverpool (8 sucursales)</option>
                  <option>CDMX (12 sucursales)</option>
                  <option>Guadalajara (6 sucursales)</option>
                  <option>Monterrey (8 sucursales)</option>
                </select>
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">← Volver</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* KPIs Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Indicadores Clave de Rendimiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 font-medium uppercase tracking-wide">Ingresos Mensuales</h3>
                <div className="text-3xl font-bold text-gray-900 mt-2">$2,847,500</div>
                <div className="text-sm text-green-600 mt-1">+12.5% vs mes anterior</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 font-medium uppercase tracking-wide">Clientes Atendidas</h3>
                <div className="text-3xl font-bold text-gray-900 mt-2">8,924</div>
                <div className="text-sm text-green-600 mt-1">+8.3% vs mes anterior</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 font-medium uppercase tracking-wide">Ticket Promedio</h3>
                <div className="text-3xl font-bold text-gray-900 mt-2">$319</div>
                <div className="text-sm text-red-500 mt-1">-2.1% vs mes anterior</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 font-medium uppercase tracking-wide">Tasa de Retención</h3>
                <div className="text-3xl font-bold text-gray-900 mt-2">78.5%</div>
                <div className="text-sm text-green-600 mt-1">+5.2% vs mes anterior</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Sucursales por Ingresos</h3>
              <div className="space-y-3">
                {[
                  { name: 'Polanco', revenue: 142800, growth: 18.5 },
                  { name: 'Santa Fe', revenue: 138200, growth: 16.3 },
                  { name: 'Liverpool Centro', revenue: 125400, growth: 15.2 },
                  { name: 'Liverpool Plaza', revenue: 118900, growth: 12.8 },
                  { name: 'Monterrey Centro', revenue: 115600, growth: 13.2 },
                  { name: 'Guadalajara Centro', revenue: 108700, growth: 11.4 },
                  { name: 'San Pedro', revenue: 102300, growth: 10.8 },
                  { name: 'Roma Norte', revenue: 96300, growth: 8.7 },
                  { name: 'Liverpool East', revenue: 95400, growth: 9.2 },
                  { name: 'Zapopan', revenue: 94800, growth: 9.1 }
                ].map((branch, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{branch.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">${branch.revenue.toLocaleString()}</div>
                      <div className="text-xs text-green-600">+{branch.growth}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Crecimiento</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enero</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '82%'}}></div>
                    </div>
                    <span className="text-sm font-medium">8.2%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Febrero</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '91%'}}></div>
                    </div>
                    <span className="text-sm font-medium">9.1%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Marzo</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '105%'}}></div>
                    </div>
                    <span className="text-sm font-medium">10.5%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Abril</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '118%'}}></div>
                    </div>
                    <span className="text-sm font-medium">11.8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mayo</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '121%'}}></div>
                    </div>
                    <span className="text-sm font-medium">12.1%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Junio</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '125%'}}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">12.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Rendimiento por Sucursal</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sucursal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clientes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Prom.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crecimiento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Liverpool Centro', city: 'Liverpool', revenue: 125400, clients: 394, growth: 15.2, status: 'excellent' },
                    { name: 'Liverpool Plaza', city: 'Liverpool', revenue: 118900, clients: 376, growth: 12.8, status: 'excellent' },
                    { name: 'Polanco', city: 'CDMX', revenue: 142800, clients: 428, growth: 18.5, status: 'excellent' },
                    { name: 'Santa Fe', city: 'CDMX', revenue: 138200, clients: 415, growth: 16.3, status: 'excellent' },
                    { name: 'Roma Norte', city: 'CDMX', revenue: 96300, clients: 312, growth: 8.7, status: 'good' },
                    { name: 'Liverpool Norte', city: 'Liverpool', revenue: 87200, clients: 274, growth: 6.8, status: 'average' },
                    { name: 'Narvarte', city: 'CDMX', revenue: 71200, clients: 224, growth: 2.1, status: 'needs-attention' },
                    { name: 'Tlalpan', city: 'CDMX', revenue: 69800, clients: 219, growth: 1.9, status: 'needs-attention' }
                  ].map((branch, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${branch.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.clients}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$319</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.growth}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          branch.status === 'excellent' ? 'bg-green-100 text-green-800' :
                          branch.status === 'good' ? 'bg-blue-100 text-blue-800' :
                          branch.status === 'average' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {branch.status === 'excellent' ? 'Excelente' :
                           branch.status === 'good' ? 'Bueno' :
                           branch.status === 'average' ? 'Promedio' :
                           'Requiere Atención'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">🚨 Oportunidad de Crecimiento</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Las sucursales de Liverpool muestran un 15% más de crecimiento que el promedio nacional. 
                Considera expandir la estrategia de marketing local a otras ciudades.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">⚡ Optimización de Horarios</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Los datos muestran que los sábados tienen 40% más demanda. Evalúa ampliar horarios 
                en sucursales con alta ocupación.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">💎 Programa de Fidelización</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                La tasa de retención ha mejorado 5.2%. El programa de puntos está funcionando 
                efectivamente y debe mantenerse.
              </p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mt-8 bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Resumen Ejecutivo para Oscar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-purple-800 mb-2">Fortalezas Clave:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Liverpool supera expectativas (+15% crecimiento)</li>
                  <li>• Retención de clientes en niveles históricos</li>
                  <li>• Crecimiento sostenido de ingresos</li>
                  <li>• 8,924 clientes atendidas mensualmente</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 mb-2">Áreas de Mejora:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Ticket promedio bajó 2.1% (requiere atención)</li>
                  <li>• 2 sucursales necesitan intervención inmediata</li>
                  <li>• Optimizar horarios en días de alta demanda</li>
                  <li>• Replicar el éxito de Liverpool</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}