import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import BookService from "./pages/customer/BookService";
import Login from "./auth/Login";


import AdminDashboard from "./pages/admin/Dashboard";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SearchWorkers from "./pages/customer/SearchWorkers";
import WorkerJobs from "./pages/worker/WorkerJobs";
//import ProtectedRoute from "./auth/ProtectedRoute";
import WorkerProfileSetup from "./pages/worker/WorkerProfileSetup";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerRequests from "./pages/customer/CustomerRequests";
import MaidAttendance from "./pages/worker/MaidAttendance";
import MaidSalary from "./pages/worker/MaidSalary";
import Login from "./auth/Login";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/worker/attendance" element={<MaidAttendance />} />
        <Route path="/worker/salary" element={<MaidSalary />} />


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

        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/requests"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerRequests />
            </ProtectedRoute>
          }
        />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
