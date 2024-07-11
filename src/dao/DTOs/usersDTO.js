import { createHash } from "../../utils.js";

class UserDTO {
  constructor({
    first_name,
    last_name,
    email,
    age,
    password,
    githubId,
    cart,
    role,
  }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.age = age;
    this.password = password;
    this.githubId = githubId;
    this.cart = cart;
    this.role = role;
  }
}

class CreateUserDTO {
  constructor({
    first_name,
    last_name,
    email,
    age,
    password,
    githubId,
    cart,
    role = "user",
  }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.age = age;
    this.password = createHash(password);
    this.githubId = githubId;
    this.cart = cart;
    this.role = role;
  }
}

// Class para manejar los datos enviados a la ruta /current
class CurrentUserDTO {
  constructor({ first_name, last_name, email, age }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.age = age;
  }
}

export { UserDTO, CreateUserDTO, CurrentUserDTO };
