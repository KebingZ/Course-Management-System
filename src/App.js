import "./App.css";
import { useRoutes } from "react-router-dom";
import RoutesTree from "./Routes";

export const user =
  window.localStorage.getItem("user") !== null
    ? JSON.parse(window.localStorage.getItem("user"))
    : null;

function App() {
  let element = useRoutes(RoutesTree(user, user?.role));
  return element;
}

export default App;
