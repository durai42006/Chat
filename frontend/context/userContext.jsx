import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/profile", { withCredentials: true });
            console.log("✅ Fetched User from /profile:", data); 
            setUser(data);
        } catch (error) {
            console.error("❌ Profile fetch error:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    fetchUser();
}, []);


  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
