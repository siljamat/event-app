import {TokenContent} from './DBTypes';
/**
 * The context for the application.
 * @typedef {Object} MyContext
 * @property {TokenContent} userdata - The user data.
 * @export
 */
type MyContext = {
  userdata?: TokenContent;
};

export {MyContext};
