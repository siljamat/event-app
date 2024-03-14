/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {CategoryTest} from '../src/types/DBTypes';

const postCategory = async (
  url: string | Function,
  newCategory: CategoryTest,
  token: string,
): Promise<CategoryTest> => {
  return new Promise((resolve, reject) => {
    request(url as string)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation CreateCategory($input: InputCategory) {
            createCategory(input: $input) {
              id
              category_name
            }
          }
        `,
        variables: {
          input: newCategory,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const category = response.body.data as CategoryTest;
          resolve(category);
        }
      });
  });
};

const putCategory = async (
  url: string | Function,
  id: string,
  category: CategoryTest,
  token: string,
): Promise<CategoryTest> => {
  return new Promise((resolve, reject) => {
    request(url as string)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
            mutation UpdateCategory($updateCategoryId: ID!, $input: updateCategory) {
              updateCategory(id: $updateCategoryId, input: $input) {
                id
                category_name
              }
            }
          `,
        variables: {
          updateCategoryId: id,
          input: category,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const updatedCategory = response.body.data
            .updateCategory as CategoryTest;
          resolve(updatedCategory);
        }
      });
  });
};

const deleteCategory = async (
  url: string | Function,
  categoryName: string,
  token: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    request(url as string)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
              mutation DeleteCategory($deleteCategoryName: String!) {
                  deleteCategory(categoryName: $deleteCategoryName) {
                      id
                      category_name
                  }
              }
              `,
        variables: {
          deleteCategoryName: categoryName,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body.data.deleteCategory);
        }
      });
  });
};

export {postCategory, putCategory, deleteCategory};
