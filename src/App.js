import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import Navbar from './Components/Home/Pages/Navbar';
import PermitForm from './Components/PermitForm/PermitForm';
import ApprovalPage from './Components/ApprovalPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/permitform" element={<PermitForm />} />
          <Route path="/approve/:permitNumber" element={<ApprovalPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
