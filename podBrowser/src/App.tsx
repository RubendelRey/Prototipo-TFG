import './App.css';
import { useSession } from '@inrupt/solid-ui-react';
import PodLogIn from './components/PodLogin';
import NavBar from './components/Navbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Files from './components/Files';

type PrivateProps = {
    children: JSX.Element
}

function App() {

  const {session} = useSession();

  function LoggedInComponent(props: PrivateProps): JSX.Element {
    if (session.info.isLoggedIn) {
        return props.children;
    }
    return <Navigate to="/login" />;
}

function NotLoggedInComponent(props: PrivateProps): JSX.Element {

    if (!session.info.isLoggedIn) {
        return props.children;
    }
    return <Navigate to="/profile" />;
}

  return (
    <div className="App">
      <NavBar />
      <div className='mainContainer'>
        <div className='background' />
        <div className='margin'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<NotLoggedInComponent children={<PodLogIn />} />} />
            <Route path="/profile" element={<LoggedInComponent children={<Profile />} />} />
            <Route path="/files" element={<LoggedInComponent children={<Files />} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <div className='background' />
      </div>
    </div>
  );
}

export default App;
