import './App.css';
import Home from './pages/Home'
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_URL}`;

  return (
    <>
      <Home />
      <ToastContainer />
    </>
  );
}

export default App;
