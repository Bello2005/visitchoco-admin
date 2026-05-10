import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { AdminShell } from '@/components/layout/AdminShell';
import { LoginPage } from '@/pages/auth/LoginPage';
import { VerifyPage } from '@/pages/auth/VerifyPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { NegociosList } from '@/pages/negocios/NegociosList';
import { InboxApprovals } from '@/pages/inbox/InboxApprovals';
import { MetricasPage } from '@/pages/metricas/MetricasPage';
import { UsuariosPage } from '@/pages/usuarios/UsuariosPage';
import { MunicipiosList } from '@/pages/municipios/MunicipiosList';
import { FaunaList } from '@/pages/fauna/FaunaList';
import { CulturaPage } from '@/pages/cultura/CulturaPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/auth/login', element: <LoginPage /> },
      { path: '/auth/verify', element: <VerifyPage /> },
      {
        path: '/',
        element: <AdminShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'negocios', element: <NegociosList /> },
          { path: 'inbox', element: <InboxApprovals /> },
          { path: 'metricas', element: <MetricasPage /> },
          { path: 'usuarios', element: <UsuariosPage /> },
          { path: 'municipios', element: <MunicipiosList /> },
          { path: 'cultura', element: <CulturaPage /> },
          { path: 'fauna', element: <FaunaList /> },
        ],
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
