import { Outlet } from "react-router-dom";
import "./App.css";
import AlertComponent from "./components/ui/AlertComponent";

const App = () => {
  return (
    <div>
      <AlertComponent />
      <Outlet />
    </div>
  );
};

export default App;
