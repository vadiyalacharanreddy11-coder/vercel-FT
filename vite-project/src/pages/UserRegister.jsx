import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserRegister = () => {
    const navigate = useNavigate();
    const { getSession } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");

     const handleSubmit = async (e) => {
  e.preventDefault();

  let name = e.target.name.value;
  let email = e.target.email.value;
  let password = e.target.password.value;
  setErrorMessage("");

  try {
    const res = await axios.post(
      "http://localhost:8000/api/auth/user/register",
      {
        fullName: name,
        emailid: email,
        password: password,
      },{withCredentials:true}
    );

    console.log("Data sent to Backend Successfully");
    await getSession();
    navigate("/");
  } catch (err) {
    setErrorMessage(err.response?.data?.message || "Unable to create your account. Please try again.");
  }
};

  return (
    <main className="page-shell">
         

      <section className="form-card">
        <h1>User Register</h1>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Enter your name" />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" />

          <button type="submit">Register</button>
        </form>
        <p className="form-footer">
          Already have an account? <Link to="/user/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default UserRegister;
