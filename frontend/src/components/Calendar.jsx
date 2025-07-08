import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CustomDatePicker() {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        console.log('Selected date:', date);
        setSelectedDate(date);
        // You can now use date-fns here, e.g., format(date, 'yyyy-MM-dd')
    };

    return (
        <div>
        <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Click to select a date"
            dateFormat="yyyy-MM-dd"
            // more props like minDate, maxDate, customInput, etc.
        />
        </div>
    );
}

export default CustomDatePicker;
