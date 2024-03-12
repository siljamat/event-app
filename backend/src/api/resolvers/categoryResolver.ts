import {isAdmin} from '../../functions/authorize';
import {Category, Event} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import CategoryModel from '../models/categoryModel';
import EventModel from '../models/eventModel';

export default {
  Event: {
    category: async (parent: Event) => {
      return await CategoryModel.findById(parent.category);
    },
  },
  Query: {
    categories: async () => {
      return await CategoryModel.find();
    },
  },
  Mutation: {
    createCategory: async (
      _parent: undefined,
      args: {input: Omit<Category, 'category_name'>},
      context: MyContext,
    ) => {
      isAdmin(context);
      const newCategory = new CategoryModel(args.input);
      return newCategory.save();
    },
    updateCategory: async (
      _parent: undefined,
      args: {id: string; category_name: string},
      context: MyContext,
    ) => {
      isAdmin(context);
      return await CategoryModel.findByIdAndUpdate(
        args.id,
        {category_name: args.category_name},
        {new: true},
      );
    },
    deleteCategory: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ) => {
      isAdmin(context);
      // delete events within category
      const events = await EventModel.find({category: args.id});
      for (const event of events) {
        await EventModel.deleteMany({
          event: event._id,
        });
      }
      return await CategoryModel.findByIdAndDelete(args.id);
    },
  },
};
