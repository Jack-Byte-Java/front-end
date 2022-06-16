import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./components/lobby/Lobby.js";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Lobby />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />)