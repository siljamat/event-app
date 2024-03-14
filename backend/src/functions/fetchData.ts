import {GraphQLError} from 'graphql';
import {ErrorResponse} from '../types/MessageTypes';
/**
 * Function for fetching data from the API.
 * @param url
 * @param options
 * @returns
 */
const fetchData = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    const errorJson = json as unknown as ErrorResponse;
    console.log(
      'throwing error',
      errorJson.message,
      response.statusText.toUpperCase(),
    );
    throw new GraphQLError(
      errorJson.message || `${response.statusText} occured`,
      {
        extensions: {
          code: response.statusText.toUpperCase(),
          http: {
            status: response.status,
          },
        },
      },
    );
  }
  return json;
};

export default fetchData;
