import Logo from "../components/Logo";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { FaUser, FaKey } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import TextArea from "../components/TextArea";
import FormFile from "../components/FormFile";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Error from "../components/Error";
import Alert from "../components/Alert";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Register = () => {
  const [newUser, setNewUser] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    about: "",
    profilePhoto: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState();
  const history = useHistory();
  const { updateUser } = useAuth();

  const updateForm = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const body = new FormData();
    for (let v in newUser) body.append(v, newUser[v]);

    if (newUser.profilePhoto === "") {
      setRegisterError("profile photo is required");
      return;
    }
    setLoading(true);
    //Post to our api
    fetch(`${BASE_URL}/api/auth/register`, {
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
          setRegisterError(data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setRegisterError("something went wrong,please try again");
      });
  };

  return (
    <div>
      {loading && (
        <Alert setOpen={setLoading}>
          <b className="capitalize">Loading!</b> Trying to sign you in
        </Alert>
      )}
      <header className="shadow-md">
        <Logo />
      </header>
      <main className="mt-6">
        <section className="p-8">
          <form
            onSubmit={handleRegister}
            className="shadow-lg p-4 space-y-4 max-w-xl m-auto"
          >
            {registerError && (
              <Error setOpen={setRegisterError} content={registerError} />
            )}
            <FormInput
              label={"user name"}
              type={"text"}
              value={newUser.userName}
              onValueChanged={(val) => updateForm("userName", val)}
            >
              <FaUser />
            </FormInput>
            <div className="flex flex-row flex-wrap align-center justify-center">
              <FormInput
                label={"First name"}
                type={"text"}
                value={newUser.firstName}
                onValueChanged={(val) => updateForm("firstName", val)}
              >
                <FaUser />
              </FormInput>
              <FormInput
                label={"Last name"}
                type={"text"}
                value={newUser.lastName}
                onValueChanged={(val) => updateForm("lastName", val)}
              >
                <FaUser />
              </FormInput>
            </div>
            <TextArea
              label={"about"}
              placeholder="Brief description about your profile"
              value={newUser.about}
              onValueChanged={(val) => updateForm("about", val)}
            />
            <FormFile
              label={"Profile photo"}
              onValueChanged={(val) => updateForm("profilePhoto", val)}
            />
            <FormInput
              label={"password"}
              type={"password"}
              value={newUser.password}
              onValueChanged={(val) => updateForm("password", val)}
            >
              <FaKey />
            </FormInput>
            <div className="flex flex-row flex-wrap justify-between items-center">
              <div className="underline text-primary">
                <Link to="/login">Already have an account? Sign In. </Link>
              </div>
              <Button classes="bg-primary block ml-auto">Sign Up</Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Register;
