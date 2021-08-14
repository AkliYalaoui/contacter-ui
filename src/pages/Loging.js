import Logo from "../components/Logo";
import svg from "../assets/authentication.svg";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { FaUser, FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Loging = () => {

  const [, setUser] = useState({
    userName: "",
    password: ""
  });

  const updateForm = (field, value) => {
    console.log(field, value);
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
  };


  return (
    <div className="container">
    <header className="shadow">
      <Logo />
    </header>
    <main className="flex items-center flex-row mt-6">
      <section className="flex-1 p-4 hidden lg:block">
        <p className="p-4 text-3xl font-medium text-gray-700 leading-10 capitalize">
          # 1 Modern social media app immitating the real world
        </p>
        <img className="mt-8" src={svg} />
      </section>

      <section className="flex-1 p-8">
          <form  onSubmit={handleLogin} className="shadow-lg p-4 space-y-4 max-w-xl m-auto">
          <div className="flex justify-center">
            <Logo/>
          </div>
          <FormInput label={"user name"} type={"text"}  onValueChanged={(val) => updateForm("username", val)}>
            <FaUser />
          </FormInput>
          <FormInput label={"password"} type={"password"}  onValueChanged={(val) => updateForm("password", val)}>
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
  )
}

export default Loging
