import { useAuth } from "../context/AuthProvider";
import { useRequestCounter } from "../context/RequestCounterProvider";
import Request from "../components/Request";
import Suggestion from "../components/Suggestion";
import { useSocket } from "../context/SocketProvider";
import { useState, useEffect } from "react";
import { FaUserAltSlash } from "react-icons/fa";
import Empty from "../components/Empty";
import Error from "../components/Error";
import Alert from "../components/Alert";

const FriendRequest = () => {
  const { user } = useAuth();
  const { setCounter } = useRequestCounter();
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [friendSuggestionsError, setFriendSuggestionsError] = useState();
  const [friendRequestsError, setFriendRequestsError] = useState();
  const [addRequestError, setaddRequestError] = useState();
  const [addRequestMsg, setaddRequestMsg] = useState();
  const [deleteRequestError, setdeleteRequestError] = useState();
  const [deleteRequestMsg, setdeleteRequestMsg] = useState();
  const [acceptRequestError, setacceptRequestError] = useState();
  const [acceptRequestMsg, setacceptRequestMsg] = useState();
  const { socket } = useSocket();

  useEffect(() => {
    socket?.emit("join-requests", user.id);
  }, [socket]);

  useEffect(() => {
    const receiveRequest = (id, r) => {
      console.log(id, r);
      setFriendRequests((prev) => [r, ...prev]);
      setCounter((prev) => prev + 1);
      setFriendSuggestions((prev) =>
        prev.filter((friend) => {
          return friend._id !== id;
        })
      );
    };
    socket?.on("receive-request", receiveRequest);
    return () => socket?.removeListener("receive-request", receiveRequest);
  }, [socket]);

  const onAddFriendHandler = (id) => {
    fetch("http://localhost:8080/api/friends/requests/create", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        "auth-token": user.token,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFriendSuggestions((prev) =>
            prev.filter((friend) => {
              return friend._id !== id;
            })
          );
          setdeleteRequestMsg(data.msg);
          socket.emit("join-requests", id);
          socket.emit("send-request", id, data.request);
        } else {
          setdeleteRequestError(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setdeleteRequestError(
          "something went wrong while trying to send the request,please try again"
        );
      });
  };
  const onDeleteRequestHandle = (id) => {
    fetch("http://localhost:8080/api/friends/requests", {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        "auth-token": user.token,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFriendRequests((prev) =>
            prev.filter((friend) => friend._id !== id)
          );
          setCounter((prev) => prev - 1);
          setaddRequestMsg(data.msg);
        } else {
          setaddRequestError(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setaddRequestError(
          "something went wrong while trying to send the request,please try again"
        );
      });
  };
  const onConfirmRequestHandler = (id) => {
    fetch("http://localhost:8080/api/friends/requests/accept", {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
        "auth-token": user.token,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFriendRequests((prev) =>
            prev.filter((friend) => friend._id !== id)
          );
          setCounter((prev) => prev - 1);
          setacceptRequestMsg(data.msg);
        } else {
          setacceptRequestError(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setacceptRequestError(
          "something went wrong while trying to send the request,please try again"
        );
      });
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/friends/suggestions", {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFriendSuggestions(data.suggestions);
        } else {
          setFriendSuggestionsError(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setFriendSuggestionsError("something went wrong,please try again");
      });
  }, [user.token]);

  useEffect(() => {
    fetch("http://localhost:8080/api/friends/requests", {
      headers: {
        "auth-token": user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFriendRequests(data.requests);
          setCounter(data.requests.length);
        } else {
          setFriendRequestsError(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setFriendRequestsError("something went wrong,please try again");
      });
  }, [user.token]);

  return (
    <div className="mt-10">
      {acceptRequestMsg && (
        <Alert>
          <b className="capitalize">Done !</b>
          {acceptRequestMsg}
        </Alert>
      )}
      {deleteRequestError && <Error content={deleteRequestError} />}
      {deleteRequestMsg && (
        <Alert>
          <b className="capitalize">Done !</b>
          {deleteRequestMsg}
        </Alert>
      )}
      {acceptRequestError && <Error content={acceptRequestError} />}
      {addRequestMsg && (
        <Alert>
          <b className="capitalize">Done !</b>
          {addRequestMsg}
        </Alert>
      )}
      {addRequestError && <Error content={addRequestError} />}
      <section>
        <h2 className="text-gray-600 font-semibold mb-4 p-2 border-b border-gray-200">
          Friend Requests
        </h2>
        {friendRequestsError && <Error content={friendRequestsError} />}
        {friendRequests.length === 0 && (
          <Empty
            icon={<FaUserAltSlash size="40px" />}
            content={"No Friend Request to display"}
          />
        )}
        {friendRequests.map((request) => (
          <Request
            key={request._id}
            person={request}
            onDeleteRequest={onDeleteRequestHandle}
            onConfirmRequest={onConfirmRequestHandler}
          />
        ))}
      </section>
      <section className="mt-8">
        <h2 className="text-gray-600 font-semibold mb-4 p-2 border-b border-gray-200">
          Friend Suggestions
        </h2>
        {friendSuggestionsError && <Error content={friendSuggestionsError} />}
        {friendSuggestions.length === 0 && (
          <Empty
            icon={<FaUserAltSlash size="40px" />}
            content={"No Friend Suggestions to display"}
          />
        )}
        {friendSuggestions.map((suggestion) => (
          <Suggestion
            onAddFriend={onAddFriendHandler}
            key={suggestion._id}
            person={suggestion}
          />
        ))}
      </section>
    </div>
  );
};

export default FriendRequest;
