import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./Components/leaftletfix.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <div className="md:mx-60">
      <App />
    </div>
  </BrowserRouter>,
);
