import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;