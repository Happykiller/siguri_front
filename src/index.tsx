import * as React from 'react';
import { createClient } from 'graphql-ws';
import { createRoot } from 'react-dom/client';
import { split, HttpLink } from "@apollo/client";
import CssBaseline from '@mui/material/CssBaseline';
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloProvider, DefaultOptions } from "@apollo/client";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import '@src/i18n';
import '@src/index.scss';
import { Home } from '@presentation/home';
import { Login } from '@presentation/login';
import { Guard } from '@presentation/guard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Guard><Home /></Guard>,
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

const getToken = () => {
  let token = process.env.APP_API_TOKEN;
  try {
    const storage = JSON.parse(sessionStorage.getItem("seguri-storage"));
    token = storage.state.accessToken;
  } catch (e) {}
  return token;
}

const wsLink = new GraphQLWsLink(createClient({
  url: process.env.APP_WS_URL,
  lazy: true,
  connectionParams: async () => {
    return {
      Authorization: `Bearer ${getToken()}`
    };
},
}));

const httpLink = new HttpLink({
  uri: process.env.APP_API_URL
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${getToken()}`,
    },
  };
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  mutate: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
}

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache,
  defaultOptions
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={apolloClient}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </ApolloProvider>
);