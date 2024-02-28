import { useContext } from "react";
import { ModeContext } from "../context/ModeProvider";

export default function useMode() {
  return useContext(ModeContext);
}
