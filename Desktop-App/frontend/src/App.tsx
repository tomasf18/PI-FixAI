import { HashRouter } from "react-router-dom";
import AppRoutes from "./routers/router";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <HashRouter>
        <AuthProvider> {/* Authentication Provider for JWT */}
          <AppRoutes />
        </AuthProvider>
    </HashRouter>
  );
}
