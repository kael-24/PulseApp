import { useState } from "react"
import CustomDatePicker from "./Calendar"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CalendarDialogBox = ({ setDateValues }) => {
    const [startDateValue, setStartDateValue] = useState(null);
    const [endDateValue, setEndDateValue] = useState(null);
    const [error, setError] = useState('')

    const handleDoneButton = () => {
        setError('')
        if (!startDateValue || !endDateValue) {
            setError('Please fill both fields')
            return
        }

        setDateValues(startDateValue, endDateValue)
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-800/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 border border-blue-700/30 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-blue-300">Select Date Range</h3>
                    <button 
                        onClick={() => setDateValues(null, null)}
                        className="text-blue-400 hover:text-teal-300 transition-colors flex items-center"
                    >
                        <ArrowBackIcon fontSize="small" />
                        <span className="ml-1">Back</span>
                    </button>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex-1 space-y-1">
                        <label className="block text-sm text-blue-300 font-medium">Start Date</label>
                        <CustomDatePicker 
                            setDateValue={(value) => setStartDateValue(value)}
                        />
                    </div>
                    
                    <div className="flex items-center justify-center px-1">
                        <ArrowForwardIcon className="text-blue-400" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                        <label className="block text-sm text-blue-300 font-medium">End Date</label>
                        <CustomDatePicker 
                            setDateValue={(value) => setEndDateValue(value)}
                        />
                    </div>
                </div>

                <button
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2 rounded-xl font-semibold shadow-md hover:from-blue-500 hover:to-teal-400 transition duration-300"
                    onClick={handleDoneButton}
                >
                    Apply Filter
                </button>

                {error && (
                    <div className="mt-2 text-sm text-red-300 bg-red-900/30 px-4 py-2 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CalendarDialogBox