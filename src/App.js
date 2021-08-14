import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useAuth } from "./context/AuthProvider";

const App = () => {
  const { user } = useAuth();
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {user ? <Redirect to="/home" /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/home" /> : <Login />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/home" /> : <Register />}
        </Route>
        <Route path="/home">{user ? <Home /> : <Redirect to="/login" />}</Route>
      </Switch>
    </Router>
  );
};

export default App;
