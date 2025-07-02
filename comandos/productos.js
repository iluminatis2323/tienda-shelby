const fs = require('fs');
const path = require('path');
const ruta = path.join(__dirname, '../db/productos.json');

function obtenerProductos() {
  return new Promise((resolve, reject) => {
    fs.readFile(ruta, 'utf-8', (err, data) => {
      if (err) return resolve([]);
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        resolve([]);
      }
    });
  });
}

function guardarProductos(productos) {
  return new Promise((resolve, reject) => {
    fs.writeFile(ruta, JSON.stringify(productos, null, 2), 'utf-8', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = { obtenerProductos, guardarProductos };
