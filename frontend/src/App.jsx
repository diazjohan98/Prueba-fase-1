import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { WorkOrdersList } from "./pages/WorkOrderList";
import { CreateWorkOrder } from "./pages/CreateWorkOrder";
import { WorkOrderDetail } from "./pages/WorkOrderDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkOrdersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nueva-orden"
            element={
              <ProtectedRoute>
                <CreateWorkOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orden/:id"
            element={
              <ProtectedRoute>
                <WorkOrderDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
