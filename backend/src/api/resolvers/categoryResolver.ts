import mongoose from 'mongoose';
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
      args: {id: string; input: {category_name: string}},
      context: MyContext,
    ) => {
      isAdmin(context);
      return await CategoryModel.findByIdAndUpdate(
        args.id,
        {category_name: args.input.category_name},
        {new: true},
      );
    },
    deleteCategory: async (
      _parent: undefined,
      args: {categoryName: string},
      context: MyContext,
    ) => {
      isAdmin(context);
      try {
        // Haetaan kategoria nimen perusteella
        const category = await CategoryModel.findOne({
          category_name: args.categoryName,
        });
        if (!category) {
          throw new Error(`Category '${args.categoryName}' not found`);
        }
        // Haetaan kaikki tapahtumat, jotka kuuluvat kategoriaan id:n perusteella
        const categoryId = category._id;
        const events = await EventModel.find({category: categoryId});
        // Poistetaan kategoria jokaisesta tapahtumasta
        await Promise.all(
          events.map(async (event) => {
            const index = event.category.indexOf(categoryId);
            if (index !== -1) {
              event.category.splice(index, 1);
              await event.save();
            }
          }),
        );
        // Poistetaan kategoria
        await CategoryModel.findByIdAndDelete(categoryId);
        return true;
      } catch (error) {
        console.error('Error deleting category and updating events:', error);
        throw new Error('Failed to delete category and update events.');
      }
    },
  },
};
