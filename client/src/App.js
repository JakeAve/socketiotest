import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import Header from './components/Header';
import Login from './components/Login';
import { UserProvider } from './context/userContext';
import { SocketProvider } from './context/socketContext';
import MainView from './components/MainView';
import Logout from './components/Logout';

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <Router>
          <Header />
          <Switch>
            <Route path="/chat/:chatroom" component={MainView} />
            <Route path="/logout" component={Logout} exact />
            <Route path={['/', '/login']} component={Login} />
          </Switch>
        </Router>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
