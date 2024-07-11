import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2'
import GoogleStrategy from 'passport-google-oauth20'
import userService from "../dao/models/user.js";
import { createHash, isValidPassword } from "../utils.js";
import config from "../config/config.js";

const LocalStrategy = local.Strategy;

// Estrategia local para Passport
const initializePassport = () => {

  /////////////////////////////////////////
  /////////// LOGIN CON GITHUB ///////////
  ////////////////////////////////////////
  passport.use("github", new GitHubStrategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    customHeaders: { 'prompt': 'select_account' }
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userService.findOne({ githubId: profile.id });
        //console.log(profile);
        if (!user) {
          let newUser = {
            first_name: profile._json.name || profile.displayName || profile.username,
            last_name: "",
            age: 20,
            email: profile._json.email || "",
            password: "",
            githubId: profile.id,
          };
          let result = await userService.create(newUser);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  ));

  ////////////////////////////////////////
  /////////// LOGIN CON GOOGLE ///////////
  ////////////////////////////////////////
  passport.use("google", new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/sessions/googlecallback",
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userService.findOne({ email: profile._json.email });
        if (!user) {
          let newUser = {
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            age: 20,
            email: profile._json.email,
            password: "",
          };
          let result = await userService.create(newUser);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
  );

  /////////////////////////////////////////
  /////////// LOGIN CON PASSPORT //////////
  ////////////////////////////////////////
  passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
    const { first_name, last_name, email, age } = req.body;
    try {
      let user = await userService.findOne({ email: username });
      if (user) {
        return done(null, false);
      }
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
      };
      let result = await userService.create(newUser);
      return done(null, result);
    } catch (error) {
      return done("Error creating user!" + error);
    }
  }
  )
  );

  passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
    try {
      const user = await userService.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: "User not found!" });
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, { message: "Invalid password!" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize de usuarios
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userService.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default initializePassport;
