import { createContext,useContext,useState } from "react";
export const AuthContext=createContext()
export const useAuth=()=>{
    return useContext(AuthContext)
}
export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const handleLogin=(user)=>{
        setUser(user)
        console.log(user)
    }
    const handleLogout=()=>{
        setUser(null)
        localStorage.removeItem('token');
    }
    return(
        <AuthContext.Provider value={{user,handleLogin,handleLogout}}>
            {children}
        </AuthContext.Provider>
    )

}