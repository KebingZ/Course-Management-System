import { user } from "../App";
import { endPoint } from "../domain";

const messageSSE = () => {
  const evtSource = new EventSource(
    `${endPoint}message/subscribe?userId=${user.userId}`,
    {
      withCredentials: true,
    }
  );
  return evtSource;
};

export default messageSSE;
