import { createContext, useState } from "react";

export const LeadersContext = createContext(null);

export function LeadersProvider({ children }) {
  const [leadersData, setLeadersData] = useState([]);

  return <LeadersContext.Provider value={{ leadersData, setLeadersData }}>{children}</LeadersContext.Provider>;
}
