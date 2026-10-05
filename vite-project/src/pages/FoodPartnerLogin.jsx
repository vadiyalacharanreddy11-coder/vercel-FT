import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { getSession } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

   const handleSubmit = async (e) => {
  e.preventDefault();

  let emailid = e.target.email.value;
  let password = e.target.password.value;
  setErrorMessage("");

  try {
    const res = await axios.post(
      "http://localhost:8000/api/auth/foodpartner/login",
      {
        emailid,
        password
      },
      { withCredentials: true }
    );

    console.log(res.data);
    await getSession();
    navigate("/createFood");

  } catch (err) {
    setErrorMessage(err.response?.data?.message || "Unable to log in. Please try again.");
  }
};


  return (
    <main className="page-shell">
      <section className="form-card">
        <h1>Food Partner Login</h1>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" />

          <button type="submit">Login</button>
        </form>
        <p className="form-footer">
          Don't have an account? <Link to="/foodpartner/register">Register</Link>
        </p>
      </section>
    </main>
  );
};

export default FoodPartnerLogin;
