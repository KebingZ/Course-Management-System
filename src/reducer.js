import { createContext, useContext, useReducer, Dispatch } from "react";

export const initialState = { total: 0, notification: 0, message: 0 };
export const MessageAction = {
  type: "INC" | "DEC",
  payload: { count: 0, type: "message" | "notification" },
};
export const reducer = (state = initialState, action = MessageAction) => {
  switch (action.type) {
    case "INC":
      return {
        ...state,
        total: state["total"] + action.payload.count,
        [action.payload.type]:
          state[action.payload.type] + action.payload.count,
      };
    case "DEC":
      return {
        ...state,
        total: state["total"] - action.payload.count,
        [action.payload.type]:
          state[action.payload.type] - action.payload.count,
      };
    default:
      return { ...state };
  }
};

export const MessageContext = createContext({});
export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer);

  return (
    <MessageContext.Provider value={{ store: state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
