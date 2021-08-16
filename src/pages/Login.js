import Logo from "../components/Logo";
import svg from "../assets/authentication.svg";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { FaUser, FaKey } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Error from "../components/Error";
import Alert from "../components/Alert";

const Login = () => {
  const [user, setUser] = useState({
    userName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState();
  const history = useHistory();
  const { updateUser } = useAuth();

  const updateForm = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const body = new FormData();
    for (let v in user) body.append(v, user[v]);

    setLoading(true);
    //Post to our api
    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          updateUser(data.user);
          history.replace("/home");
        } else {
          setLoading(false);
          setLoginError(data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setLoginError("something went wrong,please try again");
      });
  };

  return (
    <div>
      {loading && (
        <Alert>
          <b className="capitalize">Loading!</b> Trying to sign you in
        </Alert>
      )}
      <header className="shadow">
        <Logo />
      </header>
      <main className="flex items-center flex-row mt-6">
        <section className="flex-1 p-4 hidden lg:block">
          <p className="p-4 text-3xl font-medium text-gray-700 leading-10 capitalize">
            # 1 Modern social media app immitating the real world
          </p>
          <img className="mt-8" src={svg} alt="login page" />
        </section>

        <section className="flex-1 p-8">
          <form
            onSubmit={handleLogin}
            className="shadow-lg p-4 space-y-4 max-w-xl m-auto"
          >
            <div className="flex justify-center">
              <Logo />
            </div>
            {loginError && <Error content={loginError} />}
            <FormInput
              label={"user name"}
              type={"text"}
              onValueChanged={(val) => updateForm("userName", val)}
            >
              <FaUser />
            </FormInput>
            <FormInput
              label={"password"}
              type={"password"}
              onValueChanged={(val) => updateForm("password", val)}
            >
              <FaKey />
            </FormInput>
            <div className="flex flex-row flex-wrap justify-between items-center">
              <div className="underline text-primary">
                <Link to="/register">Don't have an account? Sign Up. </Link>
              </div>
              <Button classes="bg-primary block ml-auto">Sign In</Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
