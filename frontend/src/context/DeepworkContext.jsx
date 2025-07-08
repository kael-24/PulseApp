import { createContext, useReducer } from "react";

export const DeepworkContext = createContext();

export const DeepworkReducer = (state, action) => {
    switch (action.type) {
        case 'GET_SESSIONS':
            return { ...state, deepworkSessions: action.payload };
        case 'GET_SESSION':
            return { ...state, deepworkSession: action.payload };
        case 'CREATE_SESSION':
            return { ...state, deepworkSessions: [action.payload, ...(state.deepworkSessions || [])] };
        default:
            return state;
    }
};

export const DeepworkContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(DeepworkReducer, {
        deepworkSessions: [],
        deepworkSession: [],
        deepworkLoading: false,
    });

    return (
        <DeepworkContext.Provider value={{ ...state, dispatch }}>
            {children}
        </DeepworkContext.Provider>
    );
}; 