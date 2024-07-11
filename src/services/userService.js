import userModel from '../dao/models/user.js';
import { UserDTO } from '../dao/DTOs/usersDTO.js';

// Crea un nuevo usuario
async function createUser(createUserDTO) {
  const user = new userModel(createUserDTO);
  await user.save();
  return new UserDTO(user);
}

// Devuelve todos los usuarios registrados
async function getAllUsers() {
  const users = await userModel.find();
  return users.map(user => new UserDTO(user));
}

// Devuelve un usuario dado su Id
async function getUserById(uid) {
  const user = await userModel.findById(uid);
  return user ? new UserDTO(user) : null;
}

// Elimina un usuario dado su Id
async function deleteUserById(uid) {
  const user = await userModel.findByIdAndDelete(uid);
  return user ? new UserDTO(user) : null;
}

export default {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById
};
