import dotenv from 'dotenv';
import { app } from './api';

dotenv.config();

const port = process.env.API_PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Competition app listening at http://localhost:${port}`);
});

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    server.close();
  });
}
