import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { optionalAuth } from './middleware/auth.js';
import projectRoutes from './routes/projects.js';
import materialRoutes from './routes/materials.js';
import templateRoutes from './routes/templates.js';
import calculatorRoutes from './routes/calculator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

app.use(optionalAuth);

app.use('/api/projects', projectRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/calculate', calculatorRoutes);

if (isProduction) {
  const clientPath = path.join(__dirname, '../client/dist');
  console.log(`📁 Serving static files from: ${clientPath}`);
  
  app.use(express.static(clientPath));
  
  app.get('*', (req, res) => {
    const indexPath = path.join(clientPath, 'index.html');
    console.log(`🏠 Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.json({ 
      message: '🚂 Minecraft Build Planner API',
      environment: 'development',
      timestamp: new Date().toISOString()
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚂 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${isProduction ? 'production' : 'development'}`);
});
