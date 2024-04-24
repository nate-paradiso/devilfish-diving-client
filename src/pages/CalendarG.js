import React from "react";

const CalendarG = () => {
  return (
    <div className="m-4 flex justify-center">
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&title=Dive%20Calendar&showPrint=0&showTabs=0&showCalendars=0&src=ZGV2aWxmaXNoZGl2aW5nQGdtYWlsLmNvbQ&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%230B8043"
        style="border-width:0"
        width="800"
        height="600"
        frameborder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default CalendarG;
