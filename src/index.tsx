import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import '@src/i18n';
import '@src/index.scss';
import { CGU } from '@presentation/cgu';
import { Bank } from '@presentation/bank';
import { Login } from '@presentation/login';
import { Chest } from '@presentation/chest';
import { Profile } from '@presentation/profile';
import Flash from '@presentation/molecule/flash';
import { Password } from '@presentation/password';
import { Guard } from '@presentation/molecule/guard';
import { EditThing } from '@presentation/edit_thing';
import { CreateThing } from '@presentation/create_thing';
import { CreateChest } from '@presentation/create_chest';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Guard><Bank /></Guard>,
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
  {
    path: "/create_thing",
    element: <Guard><CreateThing /></Guard>,
  },
  {
    path: "/edit_thing",
    element: <Guard><EditThing /></Guard>,
  },
  {
    path: "/create_chest",
    element: <Guard><CreateChest /></Guard>,
  },
  {
    path: "/profile",
    element: <Guard><Profile /></Guard>,
  },
  {
    path: "/CGU",
    element: <CGU />,
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#03DAC6',
      light: '#FFB2FF',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#000000',
    },
    secondary: {
      main: '#018786',
      light: '#F5EBFF',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#000000',
    }
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <RouterProvider router={router} />
    <Flash/>
  </ThemeProvider>
);