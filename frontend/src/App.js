import './App.css';
import Home from './pages/Home'
import axios from "axios";

function App() {
  axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_URL}`;

  return (
    <>
      <Home />
    </>
  );
}

export default App;
