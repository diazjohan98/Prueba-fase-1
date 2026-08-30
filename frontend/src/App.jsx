import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { WorkOrdersList } from "./pages/WorkOrderList";
import { CreateWorkOrder } from "./pages/CreateWorkOrder";
import { WorkOrderDetail } from "./pages/WorkOrderDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<WorkOrdersList />} />
        <Route path="/nueva-orden" element={<CreateWorkOrder />} />
        <Route path="/orden/:id" element={<WorkOrderDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
