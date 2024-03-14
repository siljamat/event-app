import mongoose from 'mongoose';
import {Category} from '../../types/DBTypes';

/**
 * Mongoose model class for handling categories.
 * @class
 * @name CategoryModel
 * @type {mongoose.Model<Category>}
 * @extends mongoose.Model<Category>
 * @property {string} category_name - The name of the category.
 * @property {mongoose.Types.ObjectId} _id - The ID of the category.
 */
const categorySchema = new mongoose.Schema<Category>({
  /**
   * The name of the category.
   * @type {string}
   * @required
   * @unique
   */
  category_name: {
    type: String,
    required: true,
    unique: true,
  },
});

/**
 * Mongoose model for handling the category collection.
 * @type {mongoose.Model<Category>}
 */
const CategoryModel = mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;
