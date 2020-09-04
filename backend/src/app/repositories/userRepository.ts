import { getRepository, Repository } from "typeorm";
import { User } from "../models";
import { IUserInterface } from "../interfaces";

const userRepository = {
  getRepo: (): Repository<User> => {
    return getRepository(User);
  },
  userExist: async (email: string): Promise<boolean> => {
    const repository = userRepository.getRepo();
    const userExist = await repository.findOne({ email });
    return !!userExist;
  },
  listAllUsers: async (): Promise<IUserInterface[]> => {
    const repository = userRepository.getRepo();
    const allUsers = await repository.find();
    return allUsers;
  },
  showUserById: async (id: string): Promise<User | undefined> => {
    const repository = userRepository.getRepo();
    const user = await repository.findOne({ id: Number(id) });
    return user;
  },
  create: async (
    name: string,
    cpf: string,
    whatsapp: string,
    type: string,
    email: string,
    password: string
  ): Promise<IUserInterface> => {
    const repository = userRepository.getRepo();

    const user = await repository.create({
      cpf,
      name,
      whatsapp,
      type,
      email,
      password
    });

    await repository.save(user);

    return user;
  }
};

export default userRepository;
