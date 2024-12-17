import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'dist');
const destinationDir = path.join(__dirname, '..', '..', 'server', 'dist');

fs.rm(destinationDir, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error('Error al eliminar la carpeta de destino:', err);
    return;
  }

  fs.rename(sourceDir, destinationDir, (err) => {
    if (err) {
      console.error('Error al mover la carpeta:', err);
    } else {
      console.log('Carpeta "dist" movida exitosamente');
    }
  });
});
