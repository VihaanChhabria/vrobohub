import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import EventPage from "./pages/EventPage";
import EventPickerPage from "./pages/EventPickerPage";
import HeaderComponent from "./components/HeaderComponent";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <div style={{ padding: 0 }}>
      <ToastContainer />
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<EventPickerPage />} />
        <Route path="/event/:event_key" element={<EventPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
