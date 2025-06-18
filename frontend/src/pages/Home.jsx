import Navbar from '../components/Navbar'

import { useLogout } from '../hooks/useLogout';

const Home = () => {
    const { logout } = useLogout();

    const handleLogout = () => {
        logout();
    }
    return (
        <>
            <Navbar />
            <h1>This is your HOME!</h1>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
}

export default Home