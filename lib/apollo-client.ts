import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/auth-token=([^;]+)/);
  return match?.[1] ?? null;
}

const httpLink = new HttpLink({ uri: "/api/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let apolloClient: InstanceType<typeof ApolloClient> | null = null;

export function getApolloClient(): InstanceType<typeof ApolloClient> {
  if (!apolloClient) {
    apolloClient = new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),
    });
  }
  return apolloClient;
}
