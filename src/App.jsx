import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Authpage from './authpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/target/:target/apikey/:apikey" element={<Authpage />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
