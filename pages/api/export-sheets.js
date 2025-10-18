// API para exportar documentos a Google Sheets
// Versión mejorada con mejor manejo de errores

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documents } = req.body;
    
    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ error: 'Invalid documents data' });
    }

    if (documents.length === 0) {
      return res.status(400).json({ error: 'No documents to export' });
    }

    // Convertir a formato CSV para exportación
    const csvData = convertToCSV(documents);

    // Generar CSV como string
    const csvString = csvData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    console.log(`Exporting ${documents.length} documents`);

    // En producción, aquí integrarías con Google Sheets API
    // Por ahora, devolvemos los datos en formato CSV para descarga manual
    
    return res.status(200).json({ 
      success: true, 
      message: 'Data ready for export',
      count: documents.length,
      csvString: csvString,
      instructions: 'Copy the csvString value and paste it into a new Google Sheet'
    });
    
  } catch (error) {
    console.error('Error exporting to sheets:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Función auxiliar para convertir documentos a CSV
function convertToCSV(documents) {
  if (documents.length === 0) return [];

  // Encabezados
  const headers = [
    'ID',
    'Tipo',
    'Usuario',
    'Fecha',
    'Objetivo',
    'Alcance',
    'Responsables',
    'Principios Rectores',
    'Pasos del Proceso',
    'Indicadores',
    'Documentación Adicional'
  ];

  // Filas de datos
  const rows = documents.map(doc => [
    doc.id || '',
    doc.type === 'policy' ? 'Política' : 'Proceso',
    doc.username || '',
    doc.createdAt ? new Date(doc.createdAt).toLocaleString('es-ES') : '',
    doc.objective || '',
    doc.scope || '',
    doc.responsibles || '',
    doc.principles || 'N/A',
    doc.steps || 'N/A',
    doc.indicators || 'N/A',
    doc.additionalDocs || 'N/A'
  ]);

  return [headers, ...rows];
}