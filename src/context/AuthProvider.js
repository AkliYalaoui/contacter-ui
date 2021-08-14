import {useState,createContext,useContext} from 'react'


const AuthContext = createContext();
export const useAuth =  _=> useContext(AuthContext);

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(_ => {
    const storage = localStorage.getItem("user");
    if (storage) {
      return JSON.parse(storage);
    }
    return null;
  });

  const updateUser = v => {
    setUser(v);
    localStorage.setItem("user", JSON.stringify(v));
  };
  
  const value = { user, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
