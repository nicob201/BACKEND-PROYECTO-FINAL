import { response, Router } from "express";
import usersCollection from "../../dao/models/user.js";
import cartModel from "../../dao/models/cart.model.js";
import { createHash } from "../../utils.js";
import passport from "passport";
import { CurrentUserDTO } from "../../dao/DTOs/usersDTO.js";

const router = Router();

// Router para registro de usuarios
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

router.get("/failregister", async (req, res) => {
  res.send({ error: "Error registering user!" });
});

// Router para login de usuarios
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send({ status: "error", error: "Incomplete email or password" });
    }
    try {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
      };
      let cart = await cartModel.findOne({ user: req.user._id });
      if (!cart) {
        cart = await cartModel.create({ user: req.user._id, products: [] });
        await usersCollection.findByIdAndUpdate(req.user._id, { $push: { cart: { id: cart._id } } });
      }

      // Guarda la sesion
      req.session.save(err => {
        if (err) {
          return res.status(500).send("Error saving session!");
        }
        res.redirect("/products");
      });
    } catch (err) {
      res.status(500).send("Error login user!");
    }
  }
);

router.get("/faillogin", (req, res) => {
  res.send({ error: "Failed login!" });
});

// Router para logout de usuarios
router.post("/logout", async (req, res) => {
  const userId = req.user._id;

  try {
    // Elimina los carritos del usuario al cerrar la sesion
    await cartModel.deleteMany({ user: userId });

    req.logout((err) => {
      if (err) {
        console.error("Error logging out!:", err);
        return res.status(500).send("Error signing out!");
      }
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session!:", err);
          return res.status(500).send("Error signing out!");
        }
        res.clearCookie('connect.sid');
        res.redirect("/login");
      });
    });
  } catch (error) {
    console.log("Error during logout!:", error);
    res.status(500).send("Error signing out!");
  }
});

// Router para reestablecer contraseña
router.get("/reset-password", (req, res) => {
  res.render("restorePass");
});

router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found!");
    }
    user.password = createHash(password);
    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error resetting password!");
  }
});

// Login con Github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

// Login con Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/googlecallback", passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

// Current user
router.get("/current", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).send({ error: "User not authenticated!" });
  }
  const currentUserDTO = new CurrentUserDTO(req.session.user);
  res.send(currentUserDTO);
});

export default router;
