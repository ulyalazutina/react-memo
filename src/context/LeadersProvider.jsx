import { createContext, useEffect, useState } from "react";
import { getList } from "../api";

export const LeadersContext = createContext(null);

export function LeadersProvider({ children }) {
  const [leadersData, setLeadersData] = useState([]);
  const [listError, setListError] = useState(null);

  useEffect(() => {
    getList()
      .then(data => {
        setLeadersData(data.leaders);
      })
      .catch(error => {
        if (error.message === "Failed to fetch") {
          setListError("Ошибка сервера. Попробуйте зайти позже");
        }
      });
  }, []);

  return (
    <LeadersContext.Provider value={{ leadersData, setLeadersData, listError, setListError }}>
      {children}
    </LeadersContext.Provider>
  );
}
