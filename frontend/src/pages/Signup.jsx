import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { authBody, formContainer, label, input, btn } from "../styles/classNames";

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signup, error, isLoading} = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await signup(name, email, password); 
    }

    return (
    <div className={authBody}>
        <div className={formContainer}>
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">Singup</h2>

            <div className="space-y-2">
            <label className={label}>Name</label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={input}
                required
            />
            </div>

            <div className="space-y-2">
            <label className={label}>Email</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={input}
                required
            />
            </div>

            <div className="space-y-2">
            <label className={label}>Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={input}
                required
            />
            </div>

            <button
            disabled={isLoading}
            className={btn}
            >
            {isLoading ? "Singing up..." : "Signup"}
            </button>

            {error && (
            <div className="mt-4 text-sm text-red-400 bg-red-900/20 px-4 py-2 rounded-lg">
                {error}
            </div>
            )}
        </form>
        </div>
    </div>
);
}

export default Signup