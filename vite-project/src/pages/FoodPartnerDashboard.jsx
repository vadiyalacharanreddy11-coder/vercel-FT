import { useAuth } from "../context/AuthContext";

const FoodPartnerDashboard = () => {
  const { session } = useAuth();

  return (
    <main className="page-shell">
      <section className="form-card">
        <h1>Dashboard</h1>
        <p className="form-footer">
          Welcome back, {session.foodpartner?.businessname || "Food Partner"}.
        </p>
      </section>
    </main>
  );
};

export default FoodPartnerDashboard;
