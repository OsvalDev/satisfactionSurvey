import { exec } from 'child_process';
import process from 'process';

const appId = process.argv[2];

if (!appId) {
  console.error('Por favor, proporciona el ID de la aplicación para reiniciar.');
  process.exit(1);
}

exec(`pm2 restart ${appId}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar pm2 restart: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout: ${stdout}`);
});
