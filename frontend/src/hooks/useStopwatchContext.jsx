import { useContext } from "react"
import { StopwatchContext } from "../context/StopwachContext"

export const useStopwatchContext = () => {
    const context = useContext(StopwatchContext);

    if (!context) {
        throw Error('useStopwatchContext should be inside the StopwatchContext');
    }

    return context;
}