import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { authBody, formContainer, label, input, btn } from "../styles/classNames";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, error, isLoading} = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);
    }

return (
    <div className={authBody}>
        <div className={formContainer}>
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white">Login</h2>

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
            {isLoading ? "Logging in..." : "Login"}
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

export default Login