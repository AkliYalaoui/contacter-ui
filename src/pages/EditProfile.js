import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import FormInput from "../components/FormInput";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import { FiPlusCircle } from "react-icons/fi";
import Alert from "../components/Alert";
import Error from "../components/Error";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const [updatedUser, setUpdatedUser] = useState({ ...user, password: "" });
  const [updatedFile, setUpdatedFile] = useState(false);
  const [error, setError] = useState();
  const [alert, setAlert] = useState();
  const [imagePreview, setImagePreview] = useState(
    `http://localhost:8080/api/users/image/${user.profilePhoto}`
  );

  const updateForm = (field, value) => {
    setUpdatedUser((prev) => ({ ...prev, [field]: value }));
  };
  const fileChanged = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      setUpdatedFile(true);
      setImagePreview(URL.createObjectURL(file));
      updateForm("profilePhoto", file);
    }
  };
  const onFormHandler = (e) => {
    e.preventDefault();

    const body = new FormData();
    for (let v in updatedUser) {
      if (v === "password" && updatedUser[v].trim() === "") continue;
      if (v === "profilePhoto" && !updatedFile) continue;
      if (v === "id") continue;
      if (v === "token") continue;
      body.append(v, updatedUser[v]);
    }

    fetch("http://localhost:8080/api/users/update", {
      method: "PUT",
      headers: {
        "auth-token": user.token,
      },
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          updateUser((prev) => ({ ...data.user, token: prev.token }));
          setAlert(data.msg);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setError("something went wrong, try again");
      });
  };
  return (
    <div className="mt-10">
      {error && <Error setOpen={error} content={error} />}
      {alert && (
        <Alert setOpen={alert}>
          <b className="capitalize">Done !</b>
          {alert}
        </Alert>
      )}
      <header className="shadow p-2 flex space-x-2 flex-wrap items-center justify-center">
        <div className="relative">
          <img
            alt="profile"
            className="w-20 h-20 rounded-full"
            src={imagePreview}
          />
          <label
            htmlFor="updateImage"
            title="change profile image"
            className="absolute top-2/3 -right-1 shadow text-white cursor-pointer rounded-full p-1 bg-primary"
          >
            <FiPlusCircle />
          </label>
          <input
            onChange={(e) => fileChanged(e)}
            id="updateImage"
            type="file"
            className="sr-only"
            accept="image/*"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-600">{updatedUser.userName}</h3>
          <span className="text-gray-600">
            {updatedUser.firstName} {updatedUser.lastName}
          </span>
        </div>
      </header>
      <form onSubmit={onFormHandler} className="space-y-4 mt-6 shadow-lg p-2">
        <FormInput
          value={updatedUser.userName}
          label="user name"
          type="text"
          onValueChanged={(val) => updateForm("userName", val)}
        />
        <div className="flex flex-wrap">
          <div className="my-4">
            <FormInput
              value={updatedUser.firstName}
              label="first name"
              type="text"
              onValueChanged={(val) => updateForm("firstName", val)}
            />
          </div>
          <div className="my-4">
            <FormInput
              value={updatedUser.lastName}
              label="last name"
              type="text"
              onValueChanged={(val) => updateForm("lastName", val)}
            />
          </div>
        </div>
        <TextArea
          value={updatedUser.about}
          label="about"
          onValueChanged={(val) => updateForm("about", val)}
        />
        <FormInput
          value={updatedUser.password}
          onValueChanged={(val) => updateForm("password", val)}
          placeholder="leave it empty if you do not want to update it"
          label="password"
          type="password"
          label="password"
          notRequired={true}
        />
        <Button classes="bg-primary m-auto block">save changes</Button>
      </form>
    </div>
  );
};

export default EditProfile;
