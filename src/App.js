import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import { useState } from "react";
import Login from "./pages/Loging";
import Register from "./pages/Register";
import Home from './pages/Home';

const App = () => {
  const [token] = useState(false);
  return (
    <Router>
      <Switch>
        <Route path="/">
          {token ? <Redirect to="/home" /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          {token ? <Redirect to="/home" /> : <Login />}
        </Route>
        <Route path="/register">
          {token ? <Redirect to="/home" /> : <Register />}
        </Route>
        <Route path="/home">
          {token ? <Home/> : <Redirect to="/login"/>}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
