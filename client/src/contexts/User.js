import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/session", {
          credentials: "include",
        });
        if (!response.ok) {
          setUser(null);
          return;
        }
        const json = await response.json();
        if (json.success) {
          setUser(json.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("fetchSession 에러:", error);
        setUser(null);
      }
    };
    fetchSession();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
