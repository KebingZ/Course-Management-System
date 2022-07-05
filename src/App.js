import "./App.css";
import { useRoutes } from "react-router-dom";
import RoutesTree from "./Routes";

const user =
  window.localStorage.getItem("user") !== null
    ? JSON.parse(window.localStorage.getItem("user"))
    : null;

function App() {
  let element = useRoutes(RoutesTree(user));
  return element;
}

export default App;
