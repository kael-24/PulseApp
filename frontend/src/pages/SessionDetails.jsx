import { useDeepworkContext } from "../hooks/useDeepworkContext"
import { formatDuration, intervalToDuration, format } from 'date-fns';

const SessionDetails = () => {
    const { deepworkSession } = useDeepworkContext();
    
    const formatTime = (ms) => {
        const duration = intervalToDuration({ start: 0, end: ms });
        return formatDuration(duration) || "less than a second";
    }

    const formatDate = (sessionDateStart) => {
        return format(new Date(sessionDateStart), 'MMMM d, yyyy');
    }

    return(
        <div className="flex flex-col max-w-md mx-auto justify-center p-4 border border-black">
            Deepwork Session Details
            {deepworkSession && deepworkSession.deepwork && deepworkSession.deepwork.map((logDetails, index) => (
                <div className="border border-black" key={index}>
                    <div>Mode: {logDetails.mode}</div>
                    <div>Duration: {formatTime(logDetails.timeMS)}</div>
                    <div>Date: {formatDate(logDetails.timestamp)}</div>
                </div>
            ))}
        </div>
    )
}

export default SessionDetails