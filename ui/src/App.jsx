import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import EventPage from "./pages/EventPage";
import EventPickerPage from "./pages/EventPickerPage";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<EventPickerPage />} />
        <Route path="/event" element={<EventPage />} />
      </Routes>
    </>
  );
}

export default App;
