import Header from "./Header";
import Nav from "./Nav";
import { Route } from "react-router-dom";
import FriendRequests from "../pages/FriendRequest";
import Conversations from "../pages/Conversations";
import Home from "../pages/Home";
import AddPost from "../pages/AddPost";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Notification from "../pages/Notification";
import EditProfile from "../pages/EditProfile";
import RequestCounterProvider from "../context/RequestCounterProvider";
import SocketProvider from "../context/SocketProvider";

const Layout = () => {
  return (
    <SocketProvider>
      <RequestCounterProvider>
        <Header />
        <Nav />
        <main className="pl-12 pr-2 py-2 max-w-2xl m-auto">
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/notification">
            <Notification />
          </Route>
          <Route path="/add-post">
            <AddPost />
          </Route>
          <Route path="/edit-profile">
            <EditProfile />
          </Route>
          <Route path="/profile/:id">
            <Profile />
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
    </SocketProvider>
  );
};

export default Layout;
