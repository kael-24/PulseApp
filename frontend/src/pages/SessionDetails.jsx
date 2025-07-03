import { useStopwatchContext } from "../hooks/useStopwatchContext"
import { formatDuration, intervalToDuration, format } from 'date-fns';

const SessionDetails = () => {
    const { session } = useStopwatchContext();
    
    const formatTime = (ms) => {
        const duration = intervalToDuration({ start: 0, end: ms });
        return formatDuration(duration) || "less than a second";
    }

    const formatDate = (sessionDateStart) => {
        return format(new Date(sessionDateStart), 'MMMM d, yyyy');
    }

    return(
        <div className="flex flex-col max-w-md mx-auto justify-center p-4 border border-black">
            Session Details
            {session && session.session && session.session.map((sessionDetails, index) => (
                <div className="border border-black" key={index}>
                    <div>Mode: {sessionDetails.mode}</div>
                    <div>Duration: {formatTime(sessionDetails.timeMS)}</div>
                    <div>Date: {formatDate(sessionDetails.timestamp)}</div>
                </div>
            ))}
        </div>
    )
}

export default SessionDetails