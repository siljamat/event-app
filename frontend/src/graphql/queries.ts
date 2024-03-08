import {gql} from '@apollo/client';
const loginMutation = gql`
  mutation Login($credentials: Credentials!) {
    login(credentials: $credentials) {
      message
      token
      user {
        email
        id
        user_name
      }
    }
  }
`;

const registerMutation = gql`
  mutation Register($user: UserInput!) {
    register(user: $user) {
      user {
        email
        id
        user_name
      }
    }
  }
`;

const checkToken = `
query CheckToken {
    checkToken {
      message
      user {
        user_name
      }
    }
  }
`;

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

export {
  loginMutation,
  registerMutation,
  checkToken,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
