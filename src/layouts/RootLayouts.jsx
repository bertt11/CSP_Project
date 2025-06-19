import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RootLayout() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-3 shadow-sm">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src="/images/logo.jpg" alt="Logo" style={{ width: '40px' }} />
            <span className="fw-bold">ROYAL CLUB</span>
          </NavLink>

          <div className="d-flex align-items-center gap-3">
            

            {user?.role === 'user' && (
            <NavLink
              to="/user/reserve"
              className={({ isActive }) => isActive ? 'nav-link fw-bold text-primary' : 'nav-link'}
            >
              Reservation
            </NavLink>
            )}

            {user?.role === 'user' && (
            <NavLink
              to="/user/history"
              className={({ isActive }) => isActive ? 'nav-link fw-bold text-primary' : 'nav-link'}
            >
              History
            </NavLink>
            )}


            {user?.role === 'admin' && (
            <NavLink
                to="/admin"
                className={({ isActive }) => isActive ? 'nav-link fw-bold text-primary' : 'nav-link'}
            >
                Manage Meja
            </NavLink>
            )}

            {user?.role === 'admin' && (
            <NavLink
                to="/admin/manageReservasi"
                className={({ isActive }) => isActive ? 'nav-link fw-bold text-primary' : 'nav-link'}
            >
                Manage Reservasi
            </NavLink>
            )}

            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><span className="dropdown-item-text"> <strong>Selamat Datang!</strong> {user?.email || 'Guest'}</span></li>
                <li><hr className="dropdown-divider" /></li>
                {user ? (
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  
                ) : (
                  <>
                    <li><NavLink to="/login" className="dropdown-item">Login</NavLink></li>
                    <li><NavLink to="/register" className="dropdown-item">Register</NavLink></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
