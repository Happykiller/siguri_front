import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import '@src/i18n';
import '@src/index.scss';
import Flash from '@presentation/flash';
import { Home } from '@presentation/home';
import { Bank } from '@presentation/bank';
import { Login } from '@presentation/login';
import { Guard } from '@presentation/guard';
import { Chest } from '@presentation/chest';
import { Password } from '@presentation/password';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Guard><Home /></Guard>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/password",
    element: <Guard><Password /></Guard>,
  },
  {
    path: "/bank",
    element: <Guard><Bank /></Guard>,
  },
  {
    path: "/chest",
    element: <Guard><Chest /></Guard>,
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <RouterProvider router={router} />
    <Flash/>
  </ThemeProvider>
);