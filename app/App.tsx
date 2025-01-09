import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Switch>
        {/* Other routes */}
        <Route path="/admin" component={AdminDashboard} />
      </Switch>
    </Router>
  );
}

export default App; 