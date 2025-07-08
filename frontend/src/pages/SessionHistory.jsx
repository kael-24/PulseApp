import { formatDuration, intervalToDuration, startOfWeek, endOfWeek, isWithinInterval, isSameDay, isSameMonth } from 'date-fns'

import CalendarDialogBox from '../components/CalendarDialogBox';
import { useEffect, useState } from "react";
import { useDeepwork } from "../hooks/useDeepwork";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDeepworkContext } from "../hooks/useDeepworkContext";

import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';


import SessionCard from '../components/SessionCard'

const SessionHistory = () => {
    const { user } = useAuthContext();
    const { deepworkSessions } = useDeepworkContext();
    const { getDeepwork } = useDeepwork(); 

    const [filterValue, setFilterValue] = useState('');
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [calendarDialogBoxOpen, setCalendarDialogBoxOpen] = useState(false);
    const [sortedDeepworkSession, setSortedDeepworkSession] = useState([]);

    useEffect(() => {
        if (user) {
            getDeepwork();
        }
    }, [user]);

    useEffect(() => {
        setSortedDeepworkSession(deepworkSessions);
    }, [deepworkSessions]);
    

    const handleThisDateFilter = (filter) => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn : 1 });
        const end = endOfWeek(today, { weekStartsOn : 1 });

        const sortedSession = deepworkSessions.filter((session) => {
            const sessionDate = new Date(session.createdAt);
            
            if (filter === 'day'){
                return(isSameDay(today, sessionDate))
            } else if (filter === 'week'){
                return(isWithinInterval(sessionDate, {start, end}))
            } else if (filter === 'month') {
                return(isSameMonth(today, sessionDate))
            }
        })
        setSortedDeepworkSession(sortedSession)
    }

    const handleDeepworksTotalTime = (type) => {
            const totalWorkTime = sortedDeepworkSession.reduce((sum, session) => {

                const totalDeepworkTime = session.deepwork.reduce((innersum, log) => {
                    if (type === 'overallTotal') {
                        return innersum + log.timeMS;
                    } else if (type === 'work') {
                        return log.mode === 'work' ? innersum + log.timeMS : innersum;
                    }
                }, 0);
                return sum + totalDeepworkTime;

            }, 0);

            return formatDuration(intervalToDuration({ start: 0, end: totalWorkTime})); // turns into readable format
    }



    return(
        <>
            <div className="flex flex-col max-w-md mx-auto justify-center p-4 border border-black">
                <h1 className="mb-5">Session History</h1>
                
                <input 
                    className="border border-black"
                    type='text'
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />

                <button 
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                >
                    <FilterListIcon />
                </button>

                {filterMenuOpen && (
                    <button 
                        onClick={() => setSortedDeepworkSession(deepworkSessions)}
                    >
                        <CloseIcon />
                    </button>
                )}

                {filterMenuOpen && (
                    <div
                        className='border border-black'>
                        <button onClick={() => handleThisDateFilter('day')}>
                            This day
                        </button>
                        <button onClick={() => handleThisDateFilter('week')}>
                            This week
                        </button>
                        <button onClick={() => handleThisDateFilter('month')}>
                            This month
                        </button>
                        <button onClick={() => setCalendarDialogBoxOpen(!calendarDialogBoxOpen)}>
                            Choose a date
                        </button>
                        
                        {/* TODO <button onClick={}>
                            More filter
                        </button> */}
                    </div>
                )}

                <div className='border border-black'>
                    <p>Total Deepworks: {sortedDeepworkSession.length}</p>
                    <p>Total Session Time: {handleDeepworksTotalTime('overallTotal')}</p>
                    <p>Total Work Time: {handleDeepworksTotalTime('work')}</p>
                </div>


                {sortedDeepworkSession && sortedDeepworkSession.map((deepworkSession) => (
                    <SessionCard key={deepworkSession._id} deepworkSession={deepworkSession} deepworkLogs={deepworkSession.deepwork} />
                ))}

                {calendarDialogBoxOpen && (
                    <CalendarDialogBox />
                )}
            </div>
        </>
    );
}

export default SessionHistory