import { createContext, useEffect, useReducer } from "react"

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload, userLoading: false }
        case 'LOGOUT':
            return { user: null, userLoading: false }
        case 'UPDATE_USER':
            return { user: action.payload, userLoading: false }
        case 'SET_LOADING':
            return { ...state, userLoading: action.payload }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, {
        user: null,
        userLoading: true
    })
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user) {
            dispatch({ type: 'LOGIN', payload: user});
        } else {
            dispatch({ type: 'LOGOUT' })
        }
    }, [])

    console.log("AuthContext State: ", state);

    return( 
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}