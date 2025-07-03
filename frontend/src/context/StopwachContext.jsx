import { createContext, useReducer } from "react";

export const StopwatchContext = createContext();

export const StopwatchReducer = (state, action) => {
    switch (action.type) {
        case 'GET_SESSIONS':
            return { sessions: action.payload }
        case 'GET_SESSION':
            return { session: action.payload }
        case 'CREATE_SESSION':
            return { sessions: [action.payload, ...state.sessions] }
        case 'GET_CURRENT_SESSION':
            return { isCurrentSession: action.payload }
        default:  
            return state
    }
}

export const StopwatchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(StopwatchReducer, {
        sessions: [],
        session: [],
        isCurrentSession: false,
        stopwatchLoading: false
    });

    console.log("SessionContext State: ", state);

    return(
        <StopwatchContext.Provider value={{...state, dispatch}}>
            { children }
        </StopwatchContext.Provider>
    )
}