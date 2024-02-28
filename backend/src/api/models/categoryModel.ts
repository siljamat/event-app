import mongoose from 'mongoose';
import {Category} from '../../types/DBTypes';

const categorySchema = new mongoose.Schema<Category>({
  category_name: {
    type: String,
    required: true,
    unique: true,
  },
});

const CategoryModel = mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;
