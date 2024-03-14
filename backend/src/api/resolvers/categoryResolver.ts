import {isAdmin} from '../../functions/authorize';
import {Category, Event} from '../../types/DBTypes';
import {MyContext} from '../../types/MyContext';
import CategoryModel from '../models/categoryModel';
import EventModel from '../models/eventModel';

/**
 * Resolvers for handling GraphQL queries, mutations, and field resolving.
 * @namespace Resolvers
 */
export default {
  /**
   * Resolver for resolving the 'category' field of the 'Event' type.
   * @memberof Resolvers
   * @async
   * @param {Event} parent - The parent object containing the event data.
   * @returns {Promise<Category[]>} An array of categories associated with the event.
   */
  Event: {
    category: async (parent: Event) => {
      return await CategoryModel.find({_id: {$in: parent.category}});
    },
  },
  /**
   * Resolver for handling GraphQL queries.
   * @memberof Resolvers
   * @namespace Query
   */
  Query: {
    /**
     * Resolver for querying all categories.
     * @memberof Resolvers.Query
     * @async
     * @returns {Promise<Category[]>} An array of categories.
     */
    categories: async () => {
      return await CategoryModel.find();
    },
  },
  /**
   * Resolver for handling GraphQL mutations.
   * @memberof Resolvers
   * @namespace Mutation
   */
  Mutation: {
    /**
     * Resolver for creating a new category.
     * @memberof Resolvers.Mutation
     * @async
     * @param {undefined} _parent - The parent object.
     * @param {{input: Omit<Category, 'category_name'>}} args - Input data for creating the category.
     * @param {MyContext} context - The context object containing user information.
     * @returns {Promise<Category>} The newly created category.
     */
    createCategory: async (
      _parent: undefined,
      args: {input: Omit<Category, 'category_name'>},
      context: MyContext,
    ) => {
      isAdmin(context);
      const newCategory = new CategoryModel(args.input);
      return newCategory.save();
    },
    /**
     * Resolver for updating an existing category.
     * @memberof Resolvers.Mutation
     * @async
     * @param {undefined} _parent - The parent object.
     * @param {{id: string; input: {category_name: string}}} args - Input data for updating the category.
     * @param {MyContext} context - The context object containing user information.
     * @returns {Promise<Category|null>} The updated category, or null if not found.
     */
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
    /**
     * Resolver for deleting a category and updating associated events.
     * @memberof Resolvers.Mutation
     * @async
     * @param {undefined} _parent - The parent object.
     * @param {{categoryName: string}} args - Input data specifying the name of the category to delete.
     * @param {MyContext} context - The context object containing user information.
     * @returns {Promise<boolean>} A boolean indicating the success of the operation.
     */
    deleteCategory: async (
      _parent: undefined,
      args: {categoryName: string},
      context: MyContext,
    ) => {
      isAdmin(context);
      try {
        // Get the category by name
        const category = await CategoryModel.findOne({
          category_name: args.categoryName,
        });
        if (!category) {
          throw new Error(`Category '${args.categoryName}' not found`);
        }
        // Get all events associated with the category
        const categoryId = category._id;
        const events = await EventModel.find({category: categoryId});
        // Update the events
        await Promise.all(
          events.map(async (event) => {
            const index = event.category.indexOf(categoryId);
            if (index !== -1) {
              event.category.splice(index, 1);
              await event.save();
            }
          }),
        );
        // Delete the category
        await CategoryModel.findByIdAndDelete(categoryId);
        return true;
      } catch (error) {
        console.error('Error deleting category and updating events:', error);
        throw new Error('Failed to delete category and update events.');
      }
    },
  },
};
