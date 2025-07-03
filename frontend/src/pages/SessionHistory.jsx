import { useEffect } from "react";
import { useStopwatch } from "../hooks/useStopwatch";
import { useAuthContext } from "../hooks/useAuthContext";
import { useStopwatchContext } from "../hooks/useStopwatchContext";

import SessionCard from '../components/SessionCard'

const SessionHistory = () => {
    const { user } = useAuthContext();
    const { sessions } = useStopwatchContext();
    const { getStopwatch } = useStopwatch(); 

    useEffect(() => {
        if (user){
            getStopwatch();
        }
    }, [user]);

    return(
        <div className="flex flex-col max-w-md mx-auto justify-center p-4 border border-black">
            <h1 className="mb-5">Session History</h1>
            {sessions && sessions.map((session) => (
                <SessionCard key={session._id} session={session} sessionWorkloads={session.session} />
            ))}
        </div>
    );
}

export default SessionHistory