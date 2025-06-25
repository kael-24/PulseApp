import Navbar from '../components/Navbar'
import Stopwatch from '../components/Stopwatch';

import { useLogout } from '../hooks/useLogout';

const Home = () => {
    const { logout } = useLogout();

    const handleLogout = () => {
        logout();
    }
    return (
        <>
            <Navbar />
            <Stopwatch />
        </>
    );
}

export default Home