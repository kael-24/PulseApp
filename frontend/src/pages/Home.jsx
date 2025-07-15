import { useEffect } from 'react';

import Navbar from '../components/Navbar'
import Stopwatch from './Stopwatch';

import useAlarmTimer from '../hooks/useAlarmTimer';

const Home = () => {
    
    const { getAlarmTimer } = useAlarmTimer();

    useEffect(() => {
        getAlarmTimer();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900">
            <Navbar />
            <Stopwatch />
        </div>
    );
}

export default Home