import CalendarPicker from "./Calendar"


const CalendarDialogBox = () => {
    return(
        <div className="border border black">
            <label>Start</label>
            <button>
                Date
            </button>

            <label>End</label>
            <button>
                Date
            </button>
            <CalendarPicker />
        </div>
    )
}

export default CalendarDialogBox