import { createContext, useContext, useEffect, useState } from "react"


export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    const [user, setUserState] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if(storedUser){
            setUserState(JSON.parse(storedUser))
        }
    }, [])

    const setUser = (userData) => {
        setUserState(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
