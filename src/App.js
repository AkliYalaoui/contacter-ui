import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthProvider";
import Layout from "./components/Layout";
import { useEffect } from "react";
const App = () => {
  const { user } = useAuth();

  useEffect(() => {
    const tmp = localStorage.getItem("mode");
    if (tmp === "dark") {
      document.documentElement.classList.add("dark");
    }
  },[]);
  return (
    <div className="max-w-7xl m-auto min-h-screen">
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
          <Route path="*">{user ? <Layout /> : <Redirect to="/login" />}</Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
