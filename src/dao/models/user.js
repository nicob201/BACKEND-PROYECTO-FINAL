// Modelo de Usuarios
import mongoose from "mongoose";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  githubId: { type: String, unique: true, sparse: true },
  cart: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carts",
      },
    },
  ],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

const usersCollection = mongoose.model(userCollection, userSchema);

export default usersCollection;
