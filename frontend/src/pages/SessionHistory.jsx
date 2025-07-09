import { formatDuration, intervalToDuration, startOfWeek, endOfWeek, isWithinInterval, isSameDay, isSameMonth, format } from 'date-fns'
import { Link } from 'react-router-dom';
import CalendarDialogBox from '../components/CalendarDialogBox';
import { useEffect, useState } from "react";
import { useDeepwork } from "../hooks/useDeepwork";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDeepworkContext } from "../hooks/useDeepworkContext";

import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SessionCard from '../components/SessionCard'
import Alert from '@mui/material/Alert';

const SessionHistory = () => {
    const { user } = useAuthContext();
    const { deepworkSessions } = useDeepworkContext();
    const { getDeepwork } = useDeepwork(); 

    const [filterValue, setFilterValue] = useState('');
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [calendarDialogBoxOpen, setCalendarDialogBoxOpen] = useState(false);
    const [sortedDeepworkSession, setSortedDeepworkSession] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('');

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
                setCurrentFilter('This Day');
                return(isSameDay(today, sessionDate))
            } else if (filter === 'week'){
                setCurrentFilter('This Week');
                return(isWithinInterval(sessionDate, {start, end}))
            } else if (filter === 'month') {
                setCurrentFilter('This Month');
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

    const handleDateFilterValues = (start, end) => {
        const sortedSession = deepworkSessions.filter((session) => {
            const sessionDate = new Date(session.createdAt);
            return(isWithinInterval(sessionDate, {start, end}))
        });
        const formatStart = format(new Date(start), 'PPPP');
        const formatEnd = format(new Date(end), 'PPPP');
        setCurrentFilter(`${formatStart} - ${formatEnd}`);
        setSortedDeepworkSession(sortedSession);
    }

    useEffect(() => {
        if (filterValue) {
            const filteredLogs = deepworkSessions.filter((session) => {
                const lowerDeepworkName = session.deepworkName.toLowerCase();
                const lowerFilterValue = filterValue.toLowerCase();
                for (let char of lowerFilterValue) {
                    if (!lowerDeepworkName.includes(char)) {
                        return false;
                    }
                }
                return true;
            });
            setSortedDeepworkSession(filteredLogs);
        } else {
            setSortedDeepworkSession(deepworkSessions);
        }
    }, [filterValue, deepworkSessions]);

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 py-8 px-4">
            <div className="max-w-md mx-auto">
                
                
                <div className="bg-slate-800/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 border border-blue-700/30 mb-6">
                    <div className="flex justify-end mb-2">
                        <Link to="/" className="text-blue-400 hover:text-teal-300 transition-colors flex items-center">
                            <ArrowBackIcon fontSize="small" />
                            <span className="ml-1">Back</span>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-center text-blue-300 mb-6">Session History</h1>
                    
                    <div className="flex items-center mb-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon className="text-slate-500" fontSize="small" />
                            </div>
                            <input 
                                className="w-full pl-10 pr-4 py-2 bg-slate-700/80 text-white border border-blue-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition"
                                type='text'
                                placeholder="Search sessions..."
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                            />
                        </div>
                        <div className="flex ml-2 space-x-1">
                            <button 
                                className="p-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg transition"
                                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                                title={filterMenuOpen ? "Hide Filters" : "Show Filters"}
                            >
                                <FilterListIcon fontSize="small" />
                            </button>
                            
                            <button 
                                className="p-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded-lg transition"
                                onClick={() => {
                                    setSortedDeepworkSession(deepworkSessions);
                                    setCurrentFilter('All time');
                                    setFilterValue('');
                                }}
                                title="Clear Filters"
                            >
                                <CloseIcon fontSize="small" />
                            </button>
                        </div>
                    </div>

                    {filterMenuOpen && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button 
                                className="bg-slate-700/70 hover:bg-slate-700 text-blue-300 py-2 px-3 rounded-lg flex items-center justify-center transition text-sm"
                                onClick={() => handleThisDateFilter('day')}
                            >
                                <TodayIcon className="mr-1" fontSize="small" />
                                Today
                            </button>
                            <button 
                                className="bg-slate-700/70 hover:bg-slate-700 text-blue-300 py-2 px-3 rounded-lg flex items-center justify-center transition text-sm"
                                onClick={() => handleThisDateFilter('week')}
                            >
                                <DateRangeIcon className="mr-1" fontSize="small" />
                                This Week
                            </button>
                            <button 
                                className="bg-slate-700/70 hover:bg-slate-700 text-blue-300 py-2 px-3 rounded-lg flex items-center justify-center transition text-sm"
                                onClick={() => handleThisDateFilter('month')}
                            >
                                <EventNoteIcon className="mr-1" fontSize="small" />
                                This Month
                            </button>
                            <button 
                                className="bg-slate-700/70 hover:bg-slate-700 text-blue-300 py-2 px-3 rounded-lg flex items-center justify-center transition text-sm"
                                onClick={() => setCalendarDialogBoxOpen(!calendarDialogBoxOpen)}
                            >
                                <CalendarMonthIcon className="mr-1" fontSize="small" />
                                Custom Range
                            </button>
                        </div>
                    )}

                    <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                        <div className="text-blue-300 font-medium mb-3 text-left">
                            {currentFilter || 'All time'}
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <QueryStatsIcon className="mr-2 text-teal-400" />
                                    <span className="text-slate-300">Total Sessions</span>
                                </div>
                                <span className="font-semibold text-white">{sortedDeepworkSession.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <AccessTimeFilledIcon className="mr-2 text-blue-400" />
                                    <span className="text-slate-300">Total Time</span>
                                </div>
                                <span className="font-semibold text-white">{handleDeepworksTotalTime('overallTotal')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <WorkHistoryIcon className="mr-2 text-amber-400" />
                                    <span className="text-slate-300">Work Time</span>
                                </div>
                                <span className="font-semibold text-white">{handleDeepworksTotalTime('work')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {sortedDeepworkSession && sortedDeepworkSession.length > 0 ? (
                    sortedDeepworkSession.map((deepworkSession) => (
                        <SessionCard key={deepworkSession._id} deepworkSession={deepworkSession} deepworkLogs={deepworkSession.deepwork} />
                    ))
                ) : (
                    <Alert severity="info" className="bg-slate-800/90 text-blue-300 border border-blue-700/30">
                        No sessions found with current filters.
                    </Alert>
                )}

                {calendarDialogBoxOpen && (
                    <CalendarDialogBox 
                        setDateValues={(start, end) => {
                            handleDateFilterValues(start, end);
                            setCalendarDialogBoxOpen(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default SessionHistory