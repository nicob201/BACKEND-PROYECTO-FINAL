import userService from '../services/userService.js';
import { CreateUserDTO } from '../dao/DTOs/usersDTO.js';

// Crear un usuario
async function createUser(req, res) {
  try {
    const createUserDTO = new CreateUserDTO(req.body);
    const newUser = await userService.createUser(createUserDTO);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ status: 'error', error: 'Failed to create user!' });
  }
}

// Devuelve todos los usuarios
async function getUsers(req, res) {
  try {
    let users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Failed to fetch users!' });
  }
}

// Devuelve un usuario dado su ID
async function getUserById(req, res) {
  let { uid } = req.params;
  try {
    let user = await userService.getUserById(uid);
    if (!user) {
      return res.status(404).send({ status: 'error', error: 'User not found!' });
    }
    res.send(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).send({ status: 'error', error: 'Failed to get user!' });
  }
}

// Elimina un usuario dado su ID
async function deleteUserById(req, res) {
  let { uid } = req.params;
  try {
    let user = await userService.deleteUserById(uid);
    if (!user) {
      return res.status(404).send({ status: 'error', error: 'User not found!' });
    }
    res.send({ status: 'success', message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ status: 'error', error: 'Failed to delete user!' });
  }
}

export {
  createUser,
  getUsers,
  getUserById,
  deleteUserById
};
