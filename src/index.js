import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

import Widget from './Widget.jsx';

import { setContext } from '@apollo/client/link/context';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.forEach(({ message }) => {
      console.log(`Graphql error ${message}`);
      if (message === "Unauthenticated.") {
        localStorage.clear();
        client.cache.reset();
        window.location.replace("/guest-login");
      }
    });
    if (networkError) {
      console.log("Network error", networkError);
    }
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: 'https://backend.chuzeday.com/graphql' })
]);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('guest_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
  fetchOptions: {
    mode: 'no-cors',
  },
  shouldBatch: true
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <Widget businessId={window.businessId} />
  </ApolloProvider>
);