import Header from "./Header";
import Nav from "./Nav";
import { Route } from "react-router-dom";
import Home from "../pages/Home";
import FriendRequests from "../pages/FriendRequest";
import Conversations from "../pages/Conversations";
import Chat from "../pages/Chat";
import RequestCounterProvider from "../context/RequestCounterProvider";
const Layout = () => {
  return (
    <RequestCounterProvider>
      <Header />
      <Nav />
      <main className="pl-12 pr-2 py-2 max-w-2xl m-auto">
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/friend-request">
          <FriendRequests />
        </Route>
        <Route path="/conversations" exact>
          <Conversations />
        </Route>
        <Route path="/conversations/:id">
          <Chat />
        </Route>
      </main>
    </RequestCounterProvider>
  );
};

export default Layout;
