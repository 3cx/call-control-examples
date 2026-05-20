import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Nav from './components/nav';
import ConnectForm from './components/connect-form';
import PrivateRoute from './components/private-route';
import { APP_TYPE_CUSTOM_IVR, APP_TYPE_DIALER, APP_TYPE_OUTBOUND_CAMPAIGN } from './constants';
import { ErrorBoundary } from './error-boundary';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Nav />
      },
      {
        path: '/ivr',
        element: <PrivateRoute appType={APP_TYPE_CUSTOM_IVR} />
      },
      {
        path: '/campaign',
        element: <PrivateRoute appType={APP_TYPE_OUTBOUND_CAMPAIGN} />
      },
      {
        path: '/dialer',
        element: <PrivateRoute appType={APP_TYPE_DIALER} />
      },
      {
        path: '/ivr/connect',
        element: <ConnectForm appType={APP_TYPE_CUSTOM_IVR} />
      },
      {
        path: '/campaign/connect',
        element: <ConnectForm appType={APP_TYPE_OUTBOUND_CAMPAIGN} />
      },
      {
        path: '/dialer/connect',
        element: <ConnectForm appType={APP_TYPE_DIALER} />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
