import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import { AuthProvider } from './context/auth';
import SinglePost from './pages/SinglePost';
import UserPage from './pages/UserPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="ui container">
          <MenuBar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/posts/:postId' element={<SinglePost />} />
            <Route exact path='/user/:username' element={<UserPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
