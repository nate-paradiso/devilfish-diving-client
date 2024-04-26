import React, { createContext, useState, useContext } from "react";

const SelectedDateContext = createContext();

export const SelectedDateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [isDateAvailable, setIsDateAvailable] = useState(true);

  const formatDate = dateStr => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <SelectedDateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedDateStr,
        setSelectedDateStr,
        isDateAvailable,
        setIsDateAvailable,
        formatDate,
      }}
    >
      {children}
    </SelectedDateContext.Provider>
  );
};

export const useSelectedDate = () => useContext(SelectedDateContext);
