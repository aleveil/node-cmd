import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import router from './routes.js';

global.filename = fileURLToPath(import.meta.url);
global.dirname = dirname(global.filename);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
