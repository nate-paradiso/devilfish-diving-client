import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import DiverInfo from "./DiverInfo";

const CalendarComponent = () => {
  const NEXT_PUBLIC_GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const NEXT_PUBLIC_YOUR_CALENDAR_ID = process.env.NEXT_PUBLIC_YOUR_CALENDAR_ID;

  // State to store the selected date
  const [showDiverInfo, setShowDiverInfo] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState(""); // State variable to store the formatted date string
  const [selectedDate, setSelectedDate] = useState(null); // State variable to store the Date object
  // const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [googleEvents, setGoogleEvents] = useState([]);
  console.log(selectedDate);

  useEffect(() => {
    // Fetch events from Google Calendar
    const fetchGoogleCalendarEvents = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${NEXT_PUBLIC_YOUR_CALENDAR_ID}/events?key=${NEXT_PUBLIC_GOOGLE_API_KEY}`,
        );
        const data = await response.json();
        const eventDates = data.items.map(item => ({
          title: item.summary,
          start: item.start.date,
          end: item.end.date, // Optional: Add end date if available
          allDay: true, // Set to true for all-day events
        }));
        setGoogleEvents(eventDates);
      } catch (error) {
        console.error("Failed to fetch events from Google Calendar:", error);
      }
    };

    fetchGoogleCalendarEvents();
  }, []);
  // }, [NEXT_PUBLIC_GOOGLE_API_KEY, NEXT_PUBLIC_YOUR_CALENDAR_ID]);

  useEffect(() => {
    console.log(googleEvents); // Log the updated state
  }, [googleEvents]); // Run this effect whenever googleDates changes

  // Function to format the date string to "MM/DD/YYYY"
  const formatDate = dateStr => {
    if (!dateStr) return ""; // Return empty string if date is undefined
    const dateObj = new Date(dateStr);

    // Adjust for time zone offset
    const timeZoneOffset = dateObj.getTimezoneOffset();
    dateObj.setMinutes(dateObj.getMinutes() + timeZoneOffset);

    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${month}/${day}/${year}`;
  };

  // Function to handle day selection
  const handleDateSelect = arg => {
    const selectedDate = arg.startStr; // Get the selected date
    const formattedDate = formatDate(selectedDate); // Format the selected date
    setSelectedDate(selectedDate); // Store the selected date in state
    setSelectedDateStr(formattedDate); // Store the formatted selected date string in state
    // setIsDateAvailable(true); // Set the selected date as available by default
  };

  // Function to clear the selected date
  const clearSelectedDate = () => {
    setSelectedDate(null);
    // setIsDateAvailable(true); // Reset the availability status when clearing the date
    setShowDiverInfo(false);
  };

  const selectAllow = info => {
    const selectedDate = info.start.toISOString().slice(0, 10);
    // Check if any event on the selected date has the title "Available"
    const isAvailable = googleEvents.some(event => {
      const eventDate = new Date(event.start).toISOString().slice(0, 10);
      return eventDate === selectedDate && event.title === "Available";
    });
    // Allow selection only if the date has an event with the title "Available"
    return isAvailable;
  };
  // Function to handle clicking on Google Calendar events
  const handleEventClick = arg => {
    arg.jsEvent.preventDefault(); // Prevent the default behavior
  };

  // Function to get the name of the day corresponding to the selected date
  const getDayName = date => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="m-4 flex justify-center flex-col ">
        <p>
          Welcome! Select an <span className="font-extrabold">Available</span> day then click next
          to complete the forms. Min and max is 2 divers per day.
        </p>
        <br />
        {!showDiverInfo && (
          <FullCalendar
            plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true} // Enable day selection
            selectAllow={selectAllow} // Function to determine whether a day is selectable
            select={handleDateSelect} // Callback function for day selection
            googleCalendarApiKey={NEXT_PUBLIC_GOOGLE_API_KEY} // Replace with your Google Calendar API key
            events={googleEvents}
            // events={{
            //   googleCalendarId: NEXT_PUBLIC_YOUR_CALENDAR_ID, // Replace with your Google Calendar ID
            // }}
            titleFormat={{
              month: "short", // Display the month in short form
              year: "numeric",
            }}
            headerToolbar={{
              left: "today",
              center: "title",
              right: "prev,next",
            }}
            eventClick={handleEventClick} // Callback function for clicking on events
          />
        )}
        <div>
          {selectedDate && (
            <div>
              <h3 className="mt-2">
                Date Selected: {getDayName(selectedDate)} - {selectedDateStr}
              </h3>{" "}
              <h3 className="mt-1">Price: $150 per diver</h3>
              <div className="flex justify-between mb-2 flex-row">
                <button
                  className="border-solid p-2  border-2 border-sky-500 mt-1 w-32"
                  onClick={clearSelectedDate}
                >
                  Cancel
                </button>
              </div>
              <div className="flex max-w-[1200px] mx-auto ">
                {showDiverInfo ? (
                  <DiverInfo
                    selectedDate={selectedDate}
                    setShowDiverInfo={setShowDiverInfo}
                    showDiverInfo={showDiverInfo}
                  />
                ) : (
                  <button
                    className="border-solid p-2 border-2 border-sky-500 mt-1 w-32"
                    onClick={() => setShowDiverInfo(true)}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
