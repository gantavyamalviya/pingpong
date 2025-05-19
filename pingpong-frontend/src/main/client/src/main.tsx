import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import WelcomePage from './WelcomePage.tsx'
import LoginPage from './LoginPage.tsx'
import RegisterPage from './RegisterPage.tsx'

const router = createBrowserRouter([
  {
    path: '/home',
    element: <WelcomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
      path: '/',
      element: <div style={{ fontSize: 50 }}>Work in Progress 👨‍💻</div>,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
