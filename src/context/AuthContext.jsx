import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import admins from '../data/admin';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // cek apakah user sudah login sebelumnya (persisted)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // login dari Firebase
  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
       const role = admins.find(a => a.email === email) ? 'admin' : 'user';

       const userData = {
      uid: res.user.uid,
      email: res.user.email,
      role: role,
    };

      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Login error:', err.message);
    throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
