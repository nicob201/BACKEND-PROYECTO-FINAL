import express from "express";
import __dirname from "./utils.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import productRouter from "./routes/product.router.js";
import userRouter from "./routes/user.router.js";
import { create } from "express-handlebars";
import path from "path";
import session from "express-session";
import bodyParser from "body-parser";
import mongoose from "./config/database.js";
import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/api/sessions.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import messageRouter from "./routes/messages.router.js";
import config from "./config/config.js";
import configureSocket from "./config/socketConfig.js";

const app = express();

const PORT = config.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Helper eq para manejo de isAdmin o isUser en handlebars
const hbs = create({
  extname: ".handlebars",
  defaultLayout: "main",
  helpers: {
    eq: (a, b) => a === b,
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: config.MONGO_URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/messages", messageRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} OK`);
});

const io = configureSocket(httpServer);

export { io };
export default app;
