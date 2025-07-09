import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReadOnlyInput = forwardRef(({ value, onClick }, ref) => (
    <input
        type="text"
        value={value}
        onClick={onClick}
        ref={ref}
        readOnly
        placeholder="Click to select a date"
        className="w-full px-4 py-2 bg-slate-700/80 text-white border border-blue-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition cursor-pointer"
    />
));

function CustomDatePicker({ setDateValue }) {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDateValue(date);
    };

    return (
        <div className="w-full">
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                customInput={<ReadOnlyInput />}
                className="custom-datepicker"
                wrapperClassName="w-full"
                calendarClassName="bg-slate-800 text-white border border-blue-600/30 shadow-xl rounded-xl"
            />
            <style jsx="true">{`
                .react-datepicker {
                    background-color: #1e293b !important;
                    color: white !important;
                    border-color: rgba(37, 99, 235, 0.3) !important;
                    border-radius: 0.75rem !important;
                }
                .react-datepicker__header {
                    background-color: #1e293b !important;
                    border-bottom: 1px solid rgba(37, 99, 235, 0.3) !important;
                }
                .react-datepicker__current-month, 
                .react-datepicker__day-name, 
                .react-datepicker-time__header {
                    color: #93c5fd !important;
                }
                .react-datepicker__day {
                    color: #f8fafc !important;
                }
                .react-datepicker__day:hover {
                    background-color: rgba(37, 99, 235, 0.5) !important;
                }
                .react-datepicker__day--selected {
                    background-color: #2563eb !important;
                }
                .react-datepicker__day--keyboard-selected {
                    background-color: rgba(20, 184, 166, 0.5) !important;
                }
                .react-datepicker__day--outside-month {
                    color: #64748b !important;
                }
                .react-datepicker__navigation-icon::before {
                    border-color: #93c5fd !important;
                }
            `}</style>
        </div>
    );
}

export default CustomDatePicker;
