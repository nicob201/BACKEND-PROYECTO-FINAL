# Proyecto final

El presente repositorio contiene las entregas del proyecto de una API de una tienda online para el curso de Backend en Node.js

# Estructura del Repo

```bash
PROYECTO_FINAL/
│ ├── src/
│ │   ├── controllers/
│ │   │   ├── carts.js
│ │   │   ├── products.js
│ │   │
│ │   ├── data/
│ │   │   ├── carts.json
│ │   │   ├── products.json
│ │   │
│ │   ├── routes/
│ │       ├── carts.router.js
│ │       ├── products.router.js
│ ├── app.js
├── package.json
└── README.md
```

## Deployment

Server en puerto 8080

Para correr el proyecto

```bash
  npm start
```
# Productos

## GET

Ruta para productos (lista los 10 productos del "products.json")

```bash
  http://localhost:8080/api/products
```

Ruta para filtrar un producto por su ID, en este caso id = 3

```bash
  http://localhost:8080/api/products/3
```

## POST

Ruta para crear un producto, pasando por body los params Ej: {
"title": "producto 30",
"description": "descripcion 3",
"price": 204,
"thumbnail": "imagen3.jpg",
"status": true,
"category": "category 2",
"code": "P03",
"stock": 20
}

```bash
  http://localhost:8080/api/products/
```

## PUT

Ruta para actualizar un producto por su ID, en este caso id = 2 pasando los siguientes parametros por body:
{
"title": "actualizando producto",
"stock": 200000
}

```bash
  http://localhost:8080/api/products/2
```

## DELETE

Ruta para eliminar un producto por su ID, en este caso id = 10

```bash
  http://localhost:8080/api/products/10
```

# Carrito

## GET

Ruta para listar los carritos

```bash
  http://localhost:8080/api/carts
```

Ruta para listar el carrito con id = 1

```bash
  http://localhost:8080/api/carts/1
```

## POST

Ruta para crear un nuevo carrito con id incremental

```bash
  http://localhost:8080/api/carts
```

Ruta para agregar un producto al carrito, en este caso, el producto con id = 5 en el carrito con id = 1

```bash
  http://localhost:8080/api/carts/1/product/5
```
