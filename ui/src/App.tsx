
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Survey } from './pages/Survey';
import { Dashboard } from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Survey />} />
        <Route path='/results' element={<Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
