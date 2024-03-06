import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Map from '../pages/LocMap';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <div>
        {/* Wrap the JSX elements inside a parent element */}
        <Layout />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/LocMap" element={<Map />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
