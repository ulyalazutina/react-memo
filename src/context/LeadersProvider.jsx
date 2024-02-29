import { createContext, useEffect, useState } from "react";
import { getList } from "../api";

export const LeadersContext = createContext(null);

export function LeadersProvider({ children }) {
  const [leadersData, setLeadersData] = useState([]);

  useEffect(() => {
    getList().then(data => {
      setLeadersData(data.leaders);
    });
  }, []);

  return <LeadersContext.Provider value={{ leadersData, setLeadersData }}>{children}</LeadersContext.Provider>;
}
