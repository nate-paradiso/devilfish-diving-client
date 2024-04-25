import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import interactionPlugin from "@fullcalendar/interaction";
import { PayPal } from "../components/paypal";
import { useState, useEffect } from "react";

const Calendar = () => {
  const NEXT_PUBLIC_GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const NEXT_PUBLIC_YOUR_CALENDAR_ID = process.env.NEXT_PUBLIC_YOUR_CALENDAR_ID;

  // State to store the selected date
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [googleEvents, setGoogleEvents] = useState([]);

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
  }, [NEXT_PUBLIC_GOOGLE_API_KEY, NEXT_PUBLIC_YOUR_CALENDAR_ID]);

  useEffect(() => {
    console.log(googleEvents); // Log the updated state
  }, [googleEvents]); // Run this effect whenever googleDates changes

  // Function to handle day selection
  const handleDateSelect = arg => {
    setSelectedDate(arg.startStr); // Store the selected date in state
    setIsDateAvailable(true); // Set the selected date as available by default
  };

  // Function to clear the selected date
  const clearSelectedDate = () => {
    setSelectedDate(null);
    setIsDateAvailable(true); // Reset the availability status when clearing the date
  };

  const selectAllow = info => {
    const selectedDate = info.start.toISOString().slice(0, 10);
    // Check if any event on the selected date has the title "Available"
    const isAvailable = googleEvents.some(event => {
      const eventDate = new Date(event.start).toISOString().slice(0, 10);
      return eventDate === selectedDate && event.title === "Available";
    });
    // Allow selection only if the date has an event with the title "Available"
    console.log(isAvailable);
    return isAvailable;
  };
  // Function to handle clicking on Google Calendar events
  const handleEventClick = arg => {
    arg.jsEvent.preventDefault(); // Prevent the default behavior
  };

  // Function to handle PayPal transaction completion
  const handlePayPalTransaction = () => {
    setIsDateAvailable(false); // Mark the date as not available
  };

  // Function to get the name of the day corresponding to the selected date
  const getDayName = date => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  return (
    <>
      <div className="m-4">
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
        {selectedDate && (
          <div>
            <h3 className="font-bold">
              Date Selected: {getDayName(selectedDate)} - {selectedDate}
            </h3>{" "}
            <button
              className="border-solid p-2 rounded-full border-2 border-sky-500"
              onClick={clearSelectedDate}
            >
              Clear Date
            </button>
            <div className="m-4 flex justify-center">
              <PayPal selectedDate={selectedDate} onTransactionComplete={handlePayPalTransaction} />{" "}
            </div>
            {!isDateAvailable && (
              <p className="text-red-500">The selected date is not available.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;

// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { PayPal } from "../components/paypal";
// import { useState } from "react";

// // Define the generateEvents function before using it
// const generateEvents = () => {
//   const events = [];
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth();

//   for (let year = currentYear; year <= currentYear + 1; year++) {
//     for (let month = currentMonth; month <= 11; month++) {
//       for (let day = 1; day <= 31; day++) {
//         const date = new Date(year, month, day);
//         const dayOfWeek = date.getDay();

//         // Create events for Friday, Saturday, and Sunday of every week as "Available"
//         if ([5, 6, 0].includes(dayOfWeek)) {
//           events.push({
//             title: "Available",
//             start: date,
//             allDay: true,
//             color: "#008000", // Optional: customize the event color
//           });
//         }
//       }
//     }
//   }
//   return events;
// };

// const Calendar = () => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [events, setEvents] = useState(generateEvents());

//   const handleDateSelect = arg => {
//     setSelectedDate(arg.startStr);
//   };

//   const clearSelectedDate = () => {
//     setSelectedDate(null);
//   };

//   const handleEventClick = arg => {
//     arg.jsEvent.preventDefault();
//   };

//   const handlePayPalTransaction = () => {
//     console.log("PayPal transaction is calling HandlePayPalTranscation.");
//     // Find the index of the selected date event in the events array
//     const selectedIndex = events.findIndex(event => event.start === selectedDate);

//     // Remove the "Available" event for the selected date if found
//     if (selectedIndex !== -1) {
//       const updatedEvents = [...events];
//       updatedEvents.splice(selectedIndex, 1);

//       // Add a "Not available" event for the selected date
//       updatedEvents.push({
//         title: "Not available",
//         start: selectedDate,
//         allDay: true,
//         color: "#b30102", // Optional: customize the event color
//       });

//       // Update the events state with the updated events array
//       setEvents(updatedEvents);
//     }
//   };
//   const selectAllow = info => {
//     const dayOfWeek = info.start.getDay(); // Get the day of the week (0-6, where 0 is Sunday)
//     return ![1, 2, 3, 4].includes(dayOfWeek); // Return false for Monday to Thursday
//   };

//   const calendarOptions = {
//     // Other options...
//     longPressDelay: 0, // Shorten the long press delay to 0 milliseconds
//   };
//   return (
//     <>
//       <div className="m-4">
//         <p>Welcome! Select an available day and choose to pay below. Max 2 divers per day.</p>
//         <br />
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           selectable={true}
//           select={handleDateSelect}
//           selectAllow={selectAllow} // Function to determine whether a day is selectable
//           events={events}
//           titleFormat={{
//             month: "short",
//             year: "numeric",
//           }}
//           headerToolbar={{
//             left: "today",
//             center: "title",
//             right: "prev,next",
//           }}
//           eventClick={handleEventClick}
//           {...calendarOptions} // Spread the calendar options here
//         />
//         {selectedDate && (
//           <div>
//             <p>
//               Date Selected:
//               <span className="font-bold"> {selectedDate}</span>
//             </p>
//             <p>
//               Price:
//               <span className="font-black"> $300.00</span>
//             </p>
//             <button
//               className="border-solid p-2 border-2 border-darkBlue"
//               onClick={clearSelectedDate}
//             >
//               Clear Date
//             </button>
//             <div className="m-4 flex justify-center">
//               <PayPal
//                 selectedDate={selectedDate}
//                 onTransactionComplete={handlePayPalTransaction()}
//               />{" "}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Calendar;
