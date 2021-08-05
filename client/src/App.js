import AuthPage from './components/AuthPage'
import DashboardPage from './components/DashboardPage'
import AdvancedSearchPage from './components/AdvancedSearchPage';
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
          <DashboardPage />
        </Route>
        <Route path='/advancedSearch'>
          <AdvancedSearchPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
