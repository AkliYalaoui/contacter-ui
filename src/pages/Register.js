import Logo from "../components/Logo";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { FaUser, FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";
import TextArea from "../components/TextArea";
import FormFile from "../components/FormFile";
import { useState } from "react";

const Register = () => {

  const [newUser, setNewUser] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    about: "",
    profilePhoto: "",
    password: ""
  });

  const updateForm = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const body = new FormData();
    for (let v in newUser)
      body.append(v, newUser[v]);

    //Post to our api
    
  };

  return (
    <div className="container">
      <header className="shadow-md">
        <Logo />
      </header>
      <main className="mt-6">
        <section className="p-8">
          <form
            onSubmit={handleRegister}
            className="shadow-lg p-4 space-y-4 max-w-xl m-auto"
          >
            <FormInput
              label={"user name"}
              type={"text"}
              onValueChanged={(val) => updateForm("username", val)}
            >
              <FaUser />
            </FormInput>
            <div className="flex flex-row flex-wrap align-center justify-center">
              <FormInput label={"First name"} type={"text"} onValueChanged={(val) => updateForm("firstName", val)}>
                <FaUser />
              </FormInput>
              <FormInput label={"Last name"} type={"text"}  onValueChanged={(val) => updateForm("lastName", val)}>
                <FaUser />
              </FormInput>
            </div>
            <TextArea label={"about"} onValueChanged={(val) => updateForm("about", val)} />
            <FormFile label={"Profile photo"}  onValueChanged={(val) => updateForm("profilePhoto", val)} />
            <FormInput label={"password"} type={"password"} onValueChanged={(val) => updateForm("password", val)}>
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
