/* eslint-disable @typescript-eslint/no-explicit-any */

// Fetch data from the API using GraphQL
const doGraphQLFetch = async (
  url: string,
  query: string,
  variables: object,
  token?: string,
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  console.log('fetch: ', url, query, variables, headers);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  console.log('response', response);
  if (!response.ok) throw new Error(response.statusText);
  const json = await response.json();
  return json.data;
};

export {doGraphQLFetch};
