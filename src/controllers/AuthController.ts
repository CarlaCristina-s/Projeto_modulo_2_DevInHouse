import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

class AuthController {
  private userRepository;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
  }

  
}

export default AuthController;