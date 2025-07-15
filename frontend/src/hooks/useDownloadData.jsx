
import { useState } from "react";
import { useAuthContext } from "./contextHook/useAuthContext"

const useDownloadData = () => {
    const { user } = useAuthContext();
    const [downloadError, setDownloadError] = useState(null);

    const getUserDownloadData = async () => {
        try {
            const response = await fetch('/api/downloadData', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })

            if (!response.ok) {
                throw new Error((await response.json()).error || 'Error downloading file')
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `user_data_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setDownloadError(err.message);
        }
    }   

    return { getUserDownloadData, downloadError }
} 

export default useDownloadData