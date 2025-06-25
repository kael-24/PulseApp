import { useState } from "react"
import { useAuthContext } from "./useAuthContext";

const UseDeleteUser = () => {
    const [deleteError, setDeleteError] = useState(null);
    const { dispatch } = useAuthContext();

    const deleteUser = async (email, password) => {
        try {
            const response = await fetch('/api/users/userDelete', {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            })
            const json = await response.json()
            if (!response.ok) {
                setDeleteError(json.error);
                return
            }
            dispatch({type: 'LOGOUT'})
            localStorage.removeItem('user');
        } catch (error) {
            setDeleteError(error.message);
        }

    }

    return { deleteUser, deleteError }
}

export default UseDeleteUser