// AuthAutorization.jsx (or AuthContext.jsx)
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLoggedIn = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      setUser(null);
      setLoading(false); // ✅
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/login/checklogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.token);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
