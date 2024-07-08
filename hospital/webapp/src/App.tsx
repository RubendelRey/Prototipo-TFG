import './App.css';
import { useCookies } from 'react-cookie';
import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import SolidLoginSuccessful from './components/SolidLoginSuccessful';

type PrivateProps = {
    children: JSX.Element
}

function LoggedInComponent(props: PrivateProps): JSX.Element {
  const [cookies, ] = useCookies(["user"]);

  if (cookies.user !== undefined) {
      return props.children;
  }
  return <Navigate to="/login" />;
}

function NotLoggedInComponent(props: PrivateProps): JSX.Element {
    const [cookies, ] = useCookies();

    if (cookies.user === undefined) {
      return props.children;
    }
    
    return <Navigate to="/profile" />;
}

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className='margin'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<NotLoggedInComponent children={<LoginForm />} />} />
          <Route path="/profile" element={<LoggedInComponent children={<Profile />} />} />
          <Route path="/solidLoginSuccessful"  element={<SolidLoginSuccessful />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
