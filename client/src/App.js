import logo from './logo.svg';
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import './App.scss';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <AuthPage />
        </Route>
        <Route path='/dashboard'>
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
