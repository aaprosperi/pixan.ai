// API para exportar documentos a Google Sheets
// Nota: Para producción, necesitarás configurar las credenciales de Google Sheets API
// Esta es una implementación básica que devuelve los datos en formato CSV

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documents } = req.body;
    
    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ error: 'Invalid documents data' });
    }

    // Convertir a formato CSV para exportación
    const csvData = convertToCSV(documents);

    // En producción, aquí integrarías con Google Sheets API
    // Por ahora, solo confirmamos que los datos están listos para exportar
    
    // Ejemplo de integración con Google Sheets:
    // const auth = await authorize(); // Autenticar con Google
    // const sheets = google.sheets({ version: 'v4', auth });
    // await sheets.spreadsheets.values.append({
    //   spreadsheetId: 'YOUR_SPREADSHEET_ID',
    //   range: 'Sheet1!A1',
    //   valueInputOption: 'RAW',
    //   resource: { values: csvData }
    // });

    return res.status(200).json({ 
      success: true, 
      message: 'Data ready for export',
      count: documents.length,
      csvData: csvData // En producción, no devuelvas esto, solo el resultado de la operación
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
    doc.id,
    doc.type === 'policy' ? 'Política' : 'Proceso',
    doc.username,
    new Date(doc.createdAt).toLocaleString('es-ES'),
    doc.objective,
    doc.scope,
    doc.responsibles,
    doc.principles || 'N/A',
    doc.steps || 'N/A',
    doc.indicators || 'N/A',
    doc.additionalDocs || 'N/A'
  ]);

  return [headers, ...rows];
}