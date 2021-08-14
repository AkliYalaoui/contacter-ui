import { useAuth } from "../context/AuthProvider";

const Home = () => {
  const { updateUser } = useAuth();
  return (
    <div>
      <button onClick={(_) => updateUser(null)}>logout</button>
    </div>
  );
};

export default Home;
