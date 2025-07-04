import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import DiverInfo from "./DiverInfo";
import CruisePassengerInfo from "./CruisePassengerInfo";
import CruiseForm from "./CruiseForm";
import axios from "axios";
import Image from "next/image";

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

      // Filter events to include only those with titles "Dive Booked", "Dive", "1 Dive Seat", or "Cruise" or "Cruise Booked"
      const filteredEvents = data.filter(event =>
        [
          "Dive Booked",
          "Dive",
          "1 Dive Seat",
          "Cruise",
          "Cruise Booked",
          "3rd Diver",
          "3rd Booked",
          "Entire Charter",
          "Tec",
          "1 Tec Dive Seat",
          "Tec Entire Charter",
          "Entire Charter - 3 Divers",
          "Class - 3 Divers",
          "Holding",
        ].includes(event.title),
      );

      setGoogleEvents(filteredEvents);
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

    if (
      (clickedEvent.title === "Dive Booked" &&
        clickedEvent.title === "Cruise Booked" &&
        clickedEvent.title === "Holding") ||
      (clickedEvent.title !== "Dive" &&
        clickedEvent.title !== "1 Dive Seat" &&
        clickedEvent.title !== "Cruise" &&
        clickedEvent.title !== "3rd Diver" &&
        clickedEvent.title !== "Tec" &&
        clickedEvent.title !== "1 Tec Dive Seat" &&
        clickedEvent.title !== "Tec Entire Charter" &&
        clickedEvent.title !== "Entire Charter - 3 Divers" &&
        clickedEvent.title !== "Class - 3 Divers" &&
        clickedEvent.title !== "Entire Charter")
    ) {
      setShowDiverInfo(false);
      setSelectedDate(null);
      return; // Stop further execution
    }
    if (
      clickedEvent.title === "Dive" ||
      clickedEvent.title === "1 Dive Seat" ||
      clickedEvent.title === "Entire Charter" ||
      clickedEvent.title === "Tec" ||
      clickedEvent.title === "1 Tec Dive Seat" ||
      clickedEvent.title === "Tec Entire Charter" ||
      clickedEvent.title === "Entire Charter - 3 Divers" ||
      clickedEvent.title === "Class - 3 Divers" ||
      clickedEvent.title === "3rd Diver"
    ) {
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
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  const eventContent = arg => {
    // Customize the rendering of each event based on its title
    let eventClasses = ""; // Initialize event classes

    // Apply Tailwind classes based on event title
    if (arg.event.title === "Dive") {
      eventClasses = "bg-blue-500"; // Blue background for "Dive" events
    } else if (arg.event.title === "Dive Booked") {
      eventClasses = "bg-red-500"; // Red background for "Dive Booked" events
    } else if (arg.event.title === "1 Dive Seat") {
      eventClasses = "bg-blue-500"; // Green background for "Dive" events
    } else if (arg.event.title === "Tec") {
      eventClasses = "bg-blue-500"; // Green background for "Dive" events
    } else if (arg.event.title === "1 Tec Dive Seat") {
      eventClasses = "bg-blue-500"; // Green background for "Dive" events
    } else if (arg.event.title === "Tec Entire Charter") {
      eventClasses = "bg-blue-500"; // Green background for "Dive" events
    } else if (arg.event.title === "Cruise") {
      eventClasses = "bg-green-500"; // Green background for "Cruise" events
    } else if (arg.event.title === "Cruise Booked") {
      eventClasses = "bg-red-500"; // Red background for "Cruise Booked" events
    } else if (arg.event.title === "3rd Diver") {
      eventClasses = "bg-orange-500"; // Orange background for "3rd Diver" events
    } else if (arg.event.title === "Entire Charter") {
      eventClasses = "bg-blue-500"; // blue background for "Entire Charter" events
    } else if (arg.event.title === "Class - 3 Divers") {
      eventClasses = "bg-blue-500"; // blue background for "Entire Charter" events
    } else if (arg.event.title === "Entire Charter - 3 Divers") {
      eventClasses = "bg-orange-500"; // Orange background for "Entire Charter - 3 Divers" events
    } else if (arg.event.title === "3rd Booked") {
      eventClasses = "bg-red-500";
    } else if (arg.event.title === "Holding") {
      eventClasses = "bg-orange-500";
    }

    return (
      <div className={`p-0.5 ${eventClasses}`}>
        <div className="event-title">{arg.event.title}</div> {/* Render event title */}
      </div>
    );
  };

  return (
    <div className="max-w-[800px] mx-auto mt-4">
      <div className=" flex pb-3 max-w-[1000px] justify-center items-center  m-auto flex-col text-center ">
        <h1 className="text-3xl">Calendar</h1>
        <p>Book your adventure here!</p>
        <Image
          className="h-auto w-[125px] md:w-[200px] p-1" // Consistent responsive sizing
          src="/images/gpologo-invert.png"
          alt="Devilfish Logo"
          width={600}
          height={272}
        />{" "}
      </div>
      {!isSubmitted ? (
        <div>
          {loading ? (
            <p className="m-4">Loading calendar...</p>
          ) : (
            <div className="m-4 mt-0 flex justify-center flex-col ">
              <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px]">
                <h3 className="text-xl mb-1 text-center">Diving</h3>

                <p>
                  Choose between <span className="font-bold">Dive</span> or{" "}
                  <span className="font-bold"> 1 Dive Seat </span> events for an underwater
                  adventure. <span className="font-bold">Dive</span> events offer two available
                  seats, while <span className="font-bold"> 1 Dive Seat </span> events have only
                  one. For safety and enjoyment, there is a minimum and maximum of two divers per
                  outing—no solo diving allowed.
                </p>
              </div>
              <br />
              <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px]">
                <h3 className="text-xl text-center mb-1 ">Cruise</h3>
                <p>
                  Experience a scenic 3-hour tour from Elliot Bay to Blakely Rock by selecting
                  <span className="font-bold"> Cruise</span>. The
                  <span className="font-bold"> Cruise </span> event has 2 seats available. For
                  safety and enjoyment, there is a maximum of two passengers per cruise.
                </p>
              </div>
              <br />
              {!showDiverInfo && !showCruiseInfo && (
                <div className=" bg-white bg-opacity-60 shadow-lg rounded-md p-4 border-[1px]">
                  <FullCalendar
                    plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
                    className="shadow-md "
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
                    // validRange={{
                    //   start: new Date(), // Today's date
                    //   end: "9999-12-31", // Far into the future
                    // }}
                    eventClassNames={arg => {
                      // Check if the event's end date is before today
                      if (new Date(arg.event.end || arg.event.start) < new Date()) {
                        return ["past-event"]; // Apply the class for past events
                      }
                      return [];
                    }}
                  />
                </div>
              )}

              <div>
                {selectedDate && (
                  <div className="bg-white shadow-lg bg-opacity-60 rounded-md p-4 border-[1px] ">
                    <div className="text-center">
                      <h1 className="text-xl">Selected Information</h1>
                      <h3 className="mt-2">
                        Date Selected:{" "}
                        <span className="font-bold ">
                          {getDayName(selectedDate)} - {selectedDateStr}
                        </span>
                      </h3>{" "}
                      {(eventTitle === "Dive" || eventTitle === "1 Dive Seat") && (
                        <h3 className="mt-1">
                          Price: <span className="font-bold">$150 per diver +tax.</span>
                        </h3>
                      )}
                      {eventTitle === "3rd Diver" && (
                        <h3 className="mt-1">
                          Price: <span className="font-bold">$100 per diver +tax.</span>
                        </h3>
                      )}
                      {eventTitle === "Tec" && (
                        <h3 className="mt-1">
                          Price: <span className="font-bold">$165 per diver +tax.</span>
                        </h3>
                      )}
                      {eventTitle === "1 Tec Dive Seat" && (
                        <h3 className="mt-1">
                          Price: <span className="font-bold">$165 per diver +tax.</span>
                        </h3>
                      )}
                      {eventTitle === "Tec Entire Charter" && (
                        <h3 className="mt-1">
                          Price: <span className="font-bold">$330 +tax.</span>
                        </h3>
                      )}
                      {eventTitle === "Entire Charter" && (
                        <h3 className="mt-1">
                          Price: <span className="font-bold">$300 +tax.</span>
                        </h3>
                      )}
                      {eventTitle === "Entire Charter - 3 Divers" && (
                        <h3 className="mt-1">
                          Price: <span className="font-bold">$450 +tax.</span>
                        </h3>
                      )}
                      {eventTitle === "Class - 3 Divers" && (
                        <h3 className="mt-1">
                          Price: <span className="font-bold">$495 +tax.</span>
                        </h3>
                      )}
                      {eventTitle === "Cruise" && (
                        <h3 className="mt-1">
                          Price:{" "}
                          <span className="font-bold">$210 +tax for the 2.5 hour cruise.</span>
                        </h3>
                      )}{" "}
                      <div className="flex justify-center mb-2 flex-row ">
                        <button
                          className="border-solid p-2  border-2 border-sky-500 mt-1 w-32"
                          onClick={clearSelectedDate}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    {(eventTitle === "Dive" ||
                      eventTitle === "1 Dive Seat" ||
                      eventTitle === "3rd Diver" ||
                      eventTitle === "Entire Charter - 3 Divers" ||
                      eventTitle === "Class - 3 Divers" ||
                      eventTitle === "Tec" ||
                      eventTitle === "1 Tec Dive Seat" ||
                      eventTitle === "Tec Entire Charter" ||
                      eventTitle === "Entire Charter") && (
                      <div className="flex max-w-[1200px] mx-auto ">
                        <DiverInfo
                          setSelectedDate={setSelectedDate}
                          setIsSubmitted={setIsSubmitted}
                          selectedDate={selectedDate}
                          eventTitle={eventTitle}
                        />
                      </div>
                    )}{" "}
                    {eventTitle === "Cruise" && (
                      <div className="flex max-w-[1200px] mx-auto ">
                        {/* <CruisePassengerInfo
                          setSelectedDate={setSelectedDate}
                          setIsSubmitted={setIsSubmitted}
                          selectedDate={selectedDate}
                          eventTitle={eventTitle}
                        /> */}
                        <CruiseForm
                          setSelectedDate={setSelectedDate}
                          setIsSubmitted={setIsSubmitted}
                          selectedDate={selectedDate}
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
        <div className="m-8 flex justify-center bg-white shadow-lg bg-opacity-60 rounded-md p-4 border-[1px]   ">
          <div className="contact__success text-center">
            <h1 className="text-xl font-bold">Thank you!</h1>
            <br />
            We will see you at the{" "}
            {/* <a
              className="text-blue-500 font-bold"
              target="blank"
              href="https://www.google.com/maps/place/Don+Armeni+Boat+Ramp/@47.592697,-122.3848731,17z/data=!4m14!1m7!3m6!1s0x5490407498e64f5f:0x7ab08bdb66039a82!2sDon+Armeni+Boat+Ramp!8m2!3d47.592697!4d-122.3822982!16s%2Fg%2F11c3tqkqhz!3m5!1s0x5490407498e64f5f:0x7ab08bdb66039a82!8m2!3d47.592697!4d-122.3822982!16s%2Fg%2F11c3tqkqhz?entry=ttu"
            >
              Don Armeni Boat Ramp
            </a>{" "} */}
            Boat Ramp at <span className="font-bold">7:30 AM </span>
            <span className="font-bold ">
              {getDayName(selectedDate)} - {selectedDateStr}
            </span>
            <br />
            <button
              className="border-solid p-2 border-2 border-sky-500 mt-6 w-50"
              onClick={() => {
                setIsSubmitted(false);
                setShowDiverInfo(false);
                setShowCruiseInfo(false);
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
