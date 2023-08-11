import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/auth';
import Profile from './pages/profile';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/room/:id" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
        </Routes>
    );
}

export default App;
