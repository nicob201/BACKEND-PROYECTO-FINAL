import dotenv from "dotenv";

// Seleccion de entorno de trabajo, si se indica "DEVELOPMENT" utiliza el entorno de Developer
// que conecta a la database MongoDB
// Si se indica otra cosa que no sea "DEVELOPMENT", la app inicializa en el entorno "production"
// (ACLARACION: por ahora "production" tambien funciona en un entorno de MongoDB, creando una nueva Coleccion para el desarrollo)

const environment = "DEVELOPMENT";

dotenv.config({ path: environment === "DEVELOPMENT" ? "./.env.development" : "./.env.production", });

export default {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  MAILING_EMAIL: process.env.MAILING_EMAIL,
  MAILING_PASSWORD: process.env.MAILING_PASSWORD,
};
