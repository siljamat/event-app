import categoryResolver from './categoryResolver';
import eventResolver from './eventResolver';
import userResolver from './userResolver';

/**
 * GraphQL resolvers
 * @type {Resolver[]} An array of resolvers.
 */
export default [userResolver, categoryResolver, eventResolver];
