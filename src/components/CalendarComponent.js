import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import DiverInfo from "./DiverInfo";
import CruisePassengerInfo from "./CruisePassengerInfo";
// import DiverInfoTest from "./DiverInfoTest";
import axios from "axios";

const CalendarComponent = () => {
  const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  // State to store the selected date
  const [showDiverInfo, setShowDiverInfo] = useState(false);
  const [showCruiseInfo, setShowCruiseInfo] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState(""); // State variable to store the formatted date string
  const [selectedDate, setSelectedDate] = useState(null); // State variable to store the Date object
  const [googleEvents, setGoogleEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [eventTitle, setEventTitle] = useState(null);

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
  useEffect(() => {
    fetchEventsFromBackend();
  }, []);

  useEffect(() => {
    // console.log(googleEvents); // Log the updated state
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

  // Function to handle event click
  const handleEventClick = arg => {
    const clickedEvent = arg.event; // Get the clicked event object
    const selectedDate = clickedEvent.start; // Get the selected event date
    const formattedDate = formatDate(selectedDate); // Format the selected date

    if (clickedEvent.title === "Dive") {
      setSelectedDate(selectedDate); // Store the selected date in state
      setSelectedDateStr(formattedDate); // Store the formatted selected date string in state
      setShowDiverInfo(true);
      setEventTitle(clickedEvent.title);
    }
    if (clickedEvent.title === "Booked") {
      setShowDiverInfo(false);
      setSelectedDate(null);
      return; // Stop further execution
    }
    if (clickedEvent.title === "1 Dive Seat") {
      setSelectedDate(selectedDate); // Store the selected date in state
      setSelectedDateStr(formattedDate); // Store the formatted selected date string in state
      setShowDiverInfo(true);
      setEventTitle(clickedEvent.title);
    }
    if (clickedEvent.title === "Cruise") {
      setSelectedDate(selectedDate); // Store the selected date in state
      setSelectedDateStr(formattedDate); // Store the formatted selected date string in state
      setShowCruiseInfo(true);
      setEventTitle(clickedEvent.title);
    }
  };

  // Function to clear the selected date
  const clearSelectedDate = () => {
    setSelectedDate(null);
    setShowDiverInfo(false);
    setShowCruiseInfo(false);
  };

  // Function to get the name of the day corresponding to the selected date
  const getDayName = date => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  const eventContent = arg => {
    // Customize the rendering of each event based on its title
    let eventClasses = ""; // Initialize event classes

    // Apply Tailwind classes based on event title
    if (arg.event.title === "Dive") {
      eventClasses = "bg-green-500"; // Blue background for "Dive" events
    } else if (arg.event.title === "Booked") {
      eventClasses = "bg-red-500"; // Green background for "Booked" events
    } else if (arg.event.title === "1 Dive Seat") {
      eventClasses = "bg-green-500"; // Green background for "Dive" events
    } else if (arg.event.title === "Cruise") {
      eventClasses = "bg-green-500"; // Green background for "Cruise" events
    }

    return (
      <div className={`p-0.5  ${eventClasses}`}>
        {arg.event.title} {/* Render event title */}
      </div>
    );
  };

  return (
    <div className="max-w-[800px] mx-auto ">
      {!isSubmitted ? (
        <div>
          {loading ? (
            <p className="m-4">Loading calendar...</p>
          ) : (
            <div className="m-4 flex justify-center flex-col ">
              <h1 className="m-auto text-2xl">Welcome!</h1>
              <p className="text-xl">Diving</p>
              <p>
                Select a <span className="font-extrabold">Dive</span> or{" "}
                <span className="font-extrabold"> 1 Dive Seat </span> event then complete the form
                and pay. The Dive events have 2 seats open. Only single day selection allowed. There
                is a 2 diver maximum and minimum, no solo divers.
              </p>
              <br />
              <p className="text-xl">Cruise</p>
              <p>
                Select <span className="font-extrabold"> Cruise </span>for the 3 hour tour from
                Elliot Bay to Blakely Rock. 2 person maximum.
              </p>
              <br />
              <br />
              {!showDiverInfo && !showCruiseInfo && (
                <FullCalendar
                  plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
                  className="shadow-md"
                  initialView="dayGridMonth"
                  eventClick={handleEventClick}
                  events={googleEvents}
                  selectLongPressDelay={0}
                  fixedWeekCount={false}
                  showNonCurrentDates={true}
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
                  eventContent={eventContent}
                  unselectAuto={false}
                  validRange={{
                    start: new Date(), // Today's date
                    end: "9999-12-31", // Far into the future
                  }}
                />
              )}

              <div>
                {selectedDate && (
                  <div>
                    <h1 className="text-xl">Information</h1>
                    <h3 className="mt-2">
                      Date Selected:{" "}
                      <span className="font-extrabold ">
                        {getDayName(selectedDate)} - {selectedDateStr}
                      </span>
                    </h3>{" "}
                    {(eventTitle === "Dive" || eventTitle === "1 Dive Seat") && (
                      <h3 className="mt-1">
                        Price:{" "}
                        <span className="font-extrabold">$140 per diver - 2 tank dive trip.</span>
                      </h3>
                    )}
                    {eventTitle === "Cruise" && (
                      <h3 className="mt-1">
                        Price: <span className="font-extrabold">$210 for 3 hour charter.</span>
                      </h3>
                    )}{" "}
                    <div className="flex justify-between mb-2 flex-row">
                      <button
                        className="border-solid p-2  border-2 border-sky-500 mt-1 w-32"
                        onClick={clearSelectedDate}
                      >
                        Cancel
                      </button>
                    </div>
                    {(eventTitle === "Dive" || eventTitle === "1 Dive Seat") && (
                      <div className="flex max-w-[1200px] mx-auto ">
                        <DiverInfo
                          setSelectedDate={setSelectedDate}
                          setShowDiverInfo={setShowDiverInfo}
                          showDiverInfo={showDiverInfo}
                          setIsSubmitted={setIsSubmitted}
                          selectedDate={selectedDate}
                          clearSelectedDate={clearSelectedDate}
                          eventTitle={eventTitle}
                        />
                      </div>
                    )}{" "}
                    {eventTitle === "Cruise" && (
                      <div className="flex max-w-[1200px] mx-auto ">
                        <CruisePassengerInfo
                          setSelectedDate={setSelectedDate}
                          setShowDiverInfo={setShowDiverInfo}
                          showDiverInfo={showDiverInfo}
                          setIsSubmitted={setIsSubmitted}
                          selectedDate={selectedDate}
                          clearSelectedDate={clearSelectedDate}
                          eventTitle={eventTitle}
                        />
                      </div>
                    )}
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
            in Alki at <span className="font-extrabold">7:30 AM </span>
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
                fetchEventsFromBackend();
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
