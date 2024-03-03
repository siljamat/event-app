import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Map from '../pages/LocMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LocMap" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;
