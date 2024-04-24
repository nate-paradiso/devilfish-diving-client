import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import { PayPal } from "../components/paypal";
import { useState } from "react";

const Calendar = () => {
  const NEXT_GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const NEXT_YOUR_CALENDAR_ID = process.env.NEXT_PUBLIC_YOUR_CALENDAR_ID;

  // State to store the selected date
  const [selectedDate, setSelectedDate] = useState(null);
  console.log(selectedDate);

  // Function to handle day selection
  const handleDateSelect = arg => {
    setSelectedDate(arg.startStr); // Store the selected date in state
  };

  return (
    <>
      <div className="m-4">
        <FullCalendar
          plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true} // Enable day selection
          select={handleDateSelect} // Callback function for day selection
          googleCalendarApiKey={NEXT_GOOGLE_API_KEY} // Replace with your Google Calendar API key
          events={{
            googleCalendarId: NEXT_YOUR_CALENDAR_ID, // Replace with your Google Calendar ID
          }}
          titleFormat={{
            month: "short", // Display the month in short form
            year: "numeric",
          }}
          headerToolbar={{
            left: "today",
            center: "title",
            right: "prev,next",
          }}
        />
        <div className="m-4 flex justify-center">
          <PayPal selectedDate={selectedDate} />{" "}
        </div>
      </div>
    </>
  );
};

export default Calendar;
