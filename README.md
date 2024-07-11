# Proyecto final

El presente repositorio contiene las entregas del proyecto de una API Restful de un ecommerce para el curso de Backend en Node.js

# Estructura del Repo

```bash
PROYECTO_FINAL/
└───src
│   app.js
│   utils.js
│   
├───config
│       config.js
│       database.js
│       passport.config.js
│       socketConfig.js
│       
├───controllers
│       cartController.js
│       productController.js
│       userController.js
│       
├───dao
│   ├───DTOs
│   │       usersDTO.js
│   │       
│   └───models
│           cart.model.js
│           message.model.js
│           product.model.js
│           ticket.model.js
│           user.js
│
├───middleware
│       auth.js
│
├───public
│   ├───css
│   │       styles.css
│   │
│   └───js
│           carts.js
│           chat.js
│           products.js
│
├───routes
│   │   cart.router.js
│   │   messages.router.js
│   │   product.router.js
│   │   user.router.js
│   │   views.router.js
│   │
│   └───api
│           sessions.js
│
├───services
│       cartService.js
│       emailService.js
│       messageService.js
│       productService.js
│       userService.js
│
└───views
    │   carts.handlebars
    │   chat.handlebars
    │   editProduct.handlebars
    │   login.handlebars
    │   newProduct.handlebars
    │   products.handlebars
    │   profile.handlebars
    │   register.handlebars
    │   restorePass.handlebars
    │
    └───layouts
            main.handlebars
```

## Deployment

Server en puerto 8080

Para correr el proyecto

```bash
  npm start
```
# Productos

## GET

Ruta para productos

```bash
  http://localhost:8080/api/products
```

Ruta para filtrar un producto por su ID, en este caso id = 664a5d4ccb48c4c2425a975c

```bash
  http://localhost:8080/api/products/664a5d4ccb48c4c2425a975c
```

## POST

Ruta para crear un producto, pasando por body los params Ej: {
"title": "producto 30",
"description": "descripcion 3",
"price": 204,
"thumbnail": "imagen3.jpg",
"code": "P03",
"category": "Phones",
"status": true,
"stock": 20
}

```bash
  http://localhost:8080/api/products/
```

## PUT

Ruta para actualizar un producto por su ID, en este caso id = 664a5d4ccb48c4c2425a975c pasando los siguientes parametros por body:
{
"title": "actualizando producto",
"stock": 200000
}

```bash
  http://localhost:8080/api/products/664a5d4ccb48c4c2425a975c
```

## DELETE

Ruta para eliminar un producto por su ID, en este caso id = 664a5d4ccb48c4c2425a975c

```bash
  http://localhost:8080/api/products/1664a5d4ccb48c4c2425a975c
```

# Carrito

## GET

Ruta para listar los carritos

```bash
  http://localhost:8080/api/carts
```

Ruta para listar el carrito con id

```bash
  http://localhost:8080/api/carts/:cid
```

## POST

Ruta para crear un nuevo carrito

```bash
  http://localhost:8080/api/carts
```

## PUT

Ruta para actualizar un carrito, pasando por body por ejemplo: {
    "units": 500
}

```bash
  http://localhost:8080/api/carts/:cid/product/:pid
```

Ruta para agregar un producto al carrito completando el id del carrito (cid) y el id del producto a agregar (pid)

```bash
  http://localhost:8080/api/carts/:cid/product/:pid
```

## Corriendo local la API

En la ruta http://localhost:8080/products se ve asi:
![vista_products](https://github.com/user-attachments/assets/4c2a6dde-f12b-482e-972b-f8d75ca95a7f)


# Boton "New product"
Este boton carga un formulario para agregar un nuevo producto:
![boton_new_product](https://github.com/user-attachments/assets/a094fff1-7edd-4974-9083-f0eaf2cbbea0)


# Boton "edit" de cada producto:

Este boton carga un formulario con los datos precargados del producto que seleccionamos:
![boton_edit](https://github.com/user-attachments/assets/fa814b54-3d05-4cfb-a7ca-fe34de639c28)


# Carritos

Al entrar a la ruta http://localhost:8080/carts los carritos que hay creados renderizan asi:
![vista_carts](https://github.com/user-attachments/assets/d7779177-79af-44cb-9038-485bfe67fa6b)

# Register

El Registro de usuarios se ve asi:
![register_user](https://github.com/user-attachments/assets/3481225b-dc4c-4f8e-95fb-aaa8761e63d9)

# Login
![vista_login](https://github.com/user-attachments/assets/56e6ba77-2a18-430a-af1d-4d180614f6d6)

# Chat
![vista_chat](https://github.com/user-attachments/assets/0b9abdf4-4937-41be-b879-4bb47195e703)

# Profile
![vista_profile](https://github.com/user-attachments/assets/6170ca09-ec4f-4884-bce5-43906438ab1b)

# Ticket

Por ahora, el ticket que se genera a partir de una orden de compra tiene el siguiente formato:

![ticket_compra](https://github.com/user-attachments/assets/2dd8e1fa-569b-496f-bc9b-eecd25bbd22c)

Para probarlo, basta con agregar algun producto al carrito y en la pestaña "cart" dar click en el boton "Purchase"
El email que se coloque en la variable "MAILING_EMAIL" del process.env sera tanto el mail desde el que se envian los ticket como al cual se reciben.
Para probar desde el backend esta funcionaliad, se debe hacer un POST a la siguiente ruta>
```bash
  http://localhost:8080/api/carts/<completar_Con_ID_Carrito>/ticket
```
# Manejo de Roles

Roles "Admin" o "User", si se logea como Admin se habilitan los botones de "edit", "delete" y "new product", si el rol es User solo se pueden agregar productos a un carrito

