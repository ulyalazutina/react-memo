import { createContext, useState } from "react";

export const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  const [isEasyMode, setIsEasyMode] = useState(false);

  return <ModeContext.Provider value={{ isEasyMode, setIsEasyMode }}>{children}</ModeContext.Provider>;
}
