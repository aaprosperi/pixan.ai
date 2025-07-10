import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid app ID' });
  }

  try {
    const filePath = join(process.cwd(), 'pages', 'generated', `${id}.js`);
    
    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'App not found' });
    }

    const fileContent = readFileSync(filePath, 'utf8');
    
    // Extract metadata from comments
    const nameMatch = fileContent.match(/\/\/ Generated App: (.+)/);
    const timestampMatch = fileContent.match(/\/\/ Created: (.+)/);
    const descriptionMatch = fileContent.match(/\/\/ Description: (.+)/);
    
    const metadata = {
      id,
      name: nameMatch ? nameMatch[1].trim() : 'App Generada',
      timestamp: timestampMatch ? timestampMatch[1].trim() : new Date().toISOString(),
      description: descriptionMatch ? descriptionMatch[1].trim() : 'Aplicación web generada con IA',
      exists: true
    };

    return res.status(200).json(metadata);
    
  } catch (error) {
    console.error('Error loading app metadata:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}