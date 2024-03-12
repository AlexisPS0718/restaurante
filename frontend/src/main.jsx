import './index.css'
import '@mantine/core/styles.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './views/Login';
import { MantineProvider } from '@mantine/core';
import MainLayout from './layouts/MainLayout';
import Inicio from './views/Inicio';
import restauranteTheme from './CustomProvider';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import Empleados from './views/Empleados.jsx';
import Mesas from './views/Mesas.jsx';
import Comandas from './views/Comandas.jsx';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Inicio />,
      },
      {
        path: '/empleados',
        element: <Empleados />,
      },
      {
        path: '/mesas',
        element: <Mesas />,
      },
      {
        path: '/comandas',
        element: <Comandas />,
      }
    ]
  },
  {
    path: '/iniciar-sesion',
    element: <Login />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={restauranteTheme}   >
        <AuthProvider>
          <RouterProvider router={router} />

        </AuthProvider>
    </MantineProvider>
  </React.StrictMode>,
)
