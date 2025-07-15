import { useContext } from "react"
import { AlarmContext } from '../../context/AlarmContext';

export const useAlarmContext = () => {
    const context = useContext(AlarmContext);

    if (!context)
        throw Error('useAlarmContext should be within alarmContextProvider');

    return context
}