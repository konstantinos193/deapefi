import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import LeaderBoard from './components/LeaderBoard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Add other routes as needed */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </Router>
  );
}

export default App; 