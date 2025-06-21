import { createContext, useEffect, useReducer } from "react"

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload, loading: false }
        case 'LOGOUT':
            return { user: null, loading: false }
        case 'UPDATE_USER':
            return { user: action.payload, loading: false }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, {
        user: null,
        loading: true
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