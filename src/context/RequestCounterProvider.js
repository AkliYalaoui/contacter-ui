import { createContext, useContext, useState, useEffect } from "react";

const RequestCounterContext = createContext();
export const useRequestCounter = (_) => useContext(RequestCounterContext);

const RequestCounterProvider = ({ children }) => {
  const [counter, setCounter] = useState(0);

  const value = { counter, setCounter };

  return (
    <RequestCounterContext.Provider value={value}>
      {children}
    </RequestCounterContext.Provider>
  );
};

export default RequestCounterProvider;
