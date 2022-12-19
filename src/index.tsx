import React, { Suspense } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "./assets/style.scss";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter  } from "react-router-dom";
import Loader from "./layouts/loader/Loader";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const client = new ApolloClient({
  uri:"http://localhost:4000/graphql",
  cache: new InMemoryCache({addTypename: false}),
})

root.render(
  <Suspense fallback={<Loader />}>
    <BrowserRouter >
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
    </BrowserRouter >
  </Suspense>
);
