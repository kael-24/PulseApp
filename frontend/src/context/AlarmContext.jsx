import {createContext, useReducer} from 'react' 


export const AlarmContext = createContext();

export const AlarmReducer = (state, action) => {
    switch (action.type){
        case 'SET_ALARM': 
            return { ...state, ...action.payload }
        default:
            return state
    }
}

export const AlarmContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AlarmReducer, {
        isWorkAlarmEnabled: false,
        isRestAlarmEnabled: false,
        alarmWorkTime: 0,
        alarmRestTime: 0
    });

    console.log('alarmContext state: ', state);


    return(
        <AlarmContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AlarmContext.Provider>
    )
}