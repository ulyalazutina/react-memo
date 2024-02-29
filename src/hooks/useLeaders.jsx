import { useContext } from "react";
import { LeadersContext } from "../context/LeadersProvider";

export default function useLeaders() {
  return useContext(LeadersContext);
}
