import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FoodPartnerRegister = () => {
    const navigate = useNavigate();
    const { getSession } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit =async (e)=>{
        e.preventDefault();
        let businessname = e.target.businessName.value;
        let contactname = e.target.contactName.value;
        let phone = e.target.phone.value;
        let emailid=e.target.email.value
        let password=e.target.password.value;
        let address=e.target.address.value;
        let profilePic=e.target.profilePic.value;
        setErrorMessage("");

        try {
             const res = await api.post(
  "/api/auth/foodpartner/register",
  {
    businessname,
    contactname,
    phone,
    emailid,
    password,
    address,
    profilePic,
  },
  { withCredentials: true }
   );
        console.log(res);
        await getSession();
        navigate("/createFood")
        } catch (err) {
               setErrorMessage(err.response?.data?.message || "Unable to create your account. Please try again.");
        }



    }


  return (
    <main className="page-shell">
      <section className="form-card">
        <h1>Food Partner Register</h1>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="businessName">Business Name</label>
          <input id="businessName" name="businessName" type="text" placeholder="Enter business name" />

          <label htmlFor="contactName">Contact Name</label>
          <input id="contactName" name="contactName" type="text" placeholder="Enter contact name" />

          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" placeholder="Enter phone number" />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" />

          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" placeholder="Enter business address" />

          <label htmlFor="profilePic">Profile Picture URL</label>
          <input id="profilePic" name="profilePic" type="url" placeholder="Enter profile picture URL" />

          <button type="submit">Register</button>
        </form>
        <p className="form-footer">
          Already have an account? <Link to="/foodpartner/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default FoodPartnerRegister;
