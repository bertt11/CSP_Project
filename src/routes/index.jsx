import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayouts';
import ReserveTablePage from '../pages/User/PemesananMeja';
import HistoryTablePage from '../pages/User/HistoryPemesanan';
import AdminPage from '../pages/Admin/ManageMeja';
import Login from '../pages/Login';
import ProtectedRoute from '../components/protectedRoutes';
import Register from '../pages/Register';


export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
   {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [

      {
        path: '/user/reserve',
        element: (
          <ProtectedRoute>
            <ReserveTablePage />
          </ProtectedRoute>
        )
      },
      {
        path: '/user/history',
        element: (
          <ProtectedRoute>
            <HistoryTablePage />
          </ProtectedRoute>
        )
      },
       {
        path: '/admin',
        element: (
          <ProtectedRoute onlyAdmin>
            <AdminPage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
