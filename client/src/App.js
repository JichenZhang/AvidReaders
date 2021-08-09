import AuthPage from './components/AuthPage'
import DashboardPage from './components/DashboardPage'
import AdvancedSearchPage from './components/AdvancedSearchPage';
import BookPage from './components/BookPage';
import './App.scss';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import AuthorPage from './components/AuthorPage';
import SeriesPage from './components/SeriesPage';

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
        <Route path='/book'>
          <BookPage />
        </Route>
        <Route path='/author'>
          <AuthorPage />
        </Route>
        <Route path='/series'>
          <SeriesPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
