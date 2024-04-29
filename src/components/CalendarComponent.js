import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import DiverInfo from "./DiverInfo";
import axios from "axios";

const CalendarComponent = () => {
  const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  // State to store the selected date
  const [showDiverInfo, setShowDiverInfo] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState(""); // State variable to store the formatted date string
  const [selectedDate, setSelectedDate] = useState(null); // State variable to store the Date object
  // const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  console.log(selectedDate);

  useEffect(() => {
    // Fetch events from your backend endpoint using Axios
    const fetchEventsFromBackend = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/google-calendar-events`); // Endpoint on your backend
        const data = response.data;
        setGoogleEvents(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch events from backend:", error);
        setLoading(false); // Set loading state to false on error
      }
    };

    fetchEventsFromBackend();
  }, []);

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
    setShowDiverInfo(true);
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

  // Function to get the name of the day corresponding to the selected date
  const getDayName = date => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  return (
    <div className="max-w-[800px] mx-auto">
      {!isSubmitted ? (
        <div>
          {loading ? (
            <p className="m-4">Loading calendar...</p>
          ) : (
            <div className="m-4 flex justify-center flex-col ">
              <p>
                Welcome! Select the day with an <span className="font-extrabold">Available</span>{" "}
                event then click next to complete the form. Only single day selection allowed.
              </p>
              <br />
              <p>There is a 2 diver maximum and minimum, no solo divers.</p>
              <br />
              {!showDiverInfo && (
                <FullCalendar
                  plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  selectable={true} // Enable day selection
                  selectAllow={selectAllow} // Function to determine whether a day is selectable
                  select={handleDateSelect} // Callback function for day selection
                  events={googleEvents}
                  selectLongPressDelay={0}
                  fixedWeekCount={false}
                  showNonCurrentDates={false}
                  titleFormat={{
                    month: "short", // Display the month in short form
                    year: "numeric",
                  }}
                  headerToolbar={{
                    left: "today",
                    center: "title",
                    right: "prev,next",
                  }}
                  height="auto"
                  eventContent={arg => {
                    // Customize the rendering of each event based on its title
                    let eventClasses = ""; // Initialize event classes

                    // Apply Tailwind classes based on event title
                    if (arg.event.title === "Available") {
                      eventClasses = "text-black "; // Blue background for "Available" events
                    } else if (arg.event.title === "Booked") {
                      eventClasses = "bg-red-500 p-1"; // Green background for "Booked" events
                    } else if (arg.event.title === "1 Spot Left") {
                      eventClasses = "bg-red-500"; // Green background for "Booked" events
                    }

                    return (
                      <div className={`  ${eventClasses}`}>
                        {arg.event.title} {/* Render event title */}
                      </div>
                    );
                  }}
                  unselectAuto={false}
                  eventBackgroundColor="transparent"
                />
              )}

              <div>
                {selectedDate && (
                  <div>
                    <h1 className="text-xl">Diver Information</h1>
                    <h3 className="mt-2">
                      Date Selected:{" "}
                      <span className="font-extrabold ">
                        {getDayName(selectedDate)} - {selectedDateStr}
                      </span>
                    </h3>{" "}
                    <h3 className="mt-1">
                      Price: <span className="font-extrabold">$140 per diver.</span>
                    </h3>
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
                          setSelectedDate={setSelectedDate}
                          setShowDiverInfo={setShowDiverInfo}
                          showDiverInfo={showDiverInfo}
                          setIsSubmitted={setIsSubmitted}
                          selectedDate={selectedDate}
                          clearSelectedDate={clearSelectedDate}
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
          )}
        </div>
      ) : (
        <div className="m-8 flex justify-center ">
          <div className="contact__success text-center">
            <h1 className="text-xl font-bold">Thank you!</h1>
            <br />
            We will see you at the{" "}
            <a
              className="text-blue-500 font-extrabold"
              target="blank"
              href="https://www.google.com/maps/place/Don+Armeni+Boat+Ramp/@47.592697,-122.3848731,17z/data=!4m14!1m7!3m6!1s0x5490407498e64f5f:0x7ab08bdb66039a82!2sDon+Armeni+Boat+Ramp!8m2!3d47.592697!4d-122.3822982!16s%2Fg%2F11c3tqkqhz!3m5!1s0x5490407498e64f5f:0x7ab08bdb66039a82!8m2!3d47.592697!4d-122.3822982!16s%2Fg%2F11c3tqkqhz?entry=ttu"
            >
              Don Armeni Boat Ramp
            </a>{" "}
            in Alki at <span className="font-extrabold">8:00 AM </span>
            <span className="font-extrabold ">
              {getDayName(selectedDate)} - {selectedDateStr}
            </span>
            <br />
            <button
              className="border-solid p-2 border-2 border-sky-500 mt-6 w-50"
              onClick={() => {
                setIsSubmitted(false);
                setShowDiverInfo(false);
                setSelectedDate(null);
              }}
            >
              Back to Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
