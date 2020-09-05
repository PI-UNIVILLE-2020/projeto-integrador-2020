import { itemsRepository } from "../repositories";

interface IItemWithImageUrl {
  id?: number;
  name: string;
  image_url: string;
}

const itemService = {
  listAll: async (): Promise<IItemWithImageUrl[]> => {
    const items = await itemsRepository.listAllItems();
    const serializedItems = items.map(item => {
      return {
        name: item.name,
        image_url: `http://localhost:3333/uploads/${item.image}`
      };
    });
    return serializedItems;
  }
};

export default itemService;