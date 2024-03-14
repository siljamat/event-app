// Query and mutation definitions for category

const getCategories = `
query Categories {
    categories {
      category_name
      id
    }
  }
`;

const addCategory = `
mutation CreateCategory($category_name: String!) {
    createCategory(category_name: $category_name) {
      category_name
      id
    }
  }
`;

const updateCategory = `
mutation UpdateCategory($id: String!, $category_name: String!) {
    updateCategory(id: $id, category_name: $category_name) {
      category_name
      id
    }
  }
`;

const deleteCategory = `
mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      message
    }
  }
`;

export {getCategories, addCategory, updateCategory, deleteCategory};
