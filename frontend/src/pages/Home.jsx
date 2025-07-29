
import Navbar from '../components/Navbar'
import Stopwatch from './Stopwatch';


const Home = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900">
            <Stopwatch />
        </div>
    );
}

export default Home