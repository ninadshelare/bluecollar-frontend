import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import BookService from "./pages/customer/BookService";


import AdminDashboard from "./pages/admin/Dashboard";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SearchWorkers from "./pages/customer/SearchWorkers";
import WorkerJobs from "./pages/worker/WorkerJobs";
//import ProtectedRoute from "./auth/ProtectedRoute";
import WorkerProfileSetup from "./pages/worker/WorkerProfileSetup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker"
          element={
            <ProtectedRoute role="WORKER">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/book"
          element={
            <ProtectedRoute role="CUSTOMER">
              <BookService />
            </ProtectedRoute>
          }
        />



        <Route
          path="/customer/search"
          element={
            <ProtectedRoute role="CUSTOMER">
              <SearchWorkers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker/jobs"
          element={
            <ProtectedRoute role="WORKER">
              <WorkerJobs />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/worker/profile"
          element={
            <ProtectedRoute role="WORKER">
              <WorkerProfileSetup />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
