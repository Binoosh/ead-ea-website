import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LoginPage from "../pages/auth/Login";
import SignUpPage from "../pages/auth/SignUp";
import ProfileDetails from "../pages/auth/ProfileDetails";
import AddEVOwners from "../pages/dashboard/backoffice/AddEVOwners";
import ViewEVOwners from "../pages/dashboard/backoffice/ViewEVOwners";
import AddChargeStation from "../pages/dashboard/stationoperator/AddChargeStation";
import ViewChargeStations from "../pages/dashboard/backoffice/ViewChargeStations";
import ViewReservations from "../pages/dashboard/backoffice/ViewReservations";
import AddReservation from "../pages/dashboard/backoffice/AddReservation";
import Home from "../pages/public/Home";
import EVChargingStations from "../pages/public/EVChargingStations";
import EVOwnerLogin from "../pages/auth/EVOwnerLogin";
import RegisterEVOwners from "../pages/auth/RegisterEVOwners";
import ViewMyChargeStations from "../pages/dashboard/stationoperator/ViewMyChargeStations";
import ViewMyReservations from "../pages/dashboard/stationoperator/ViewMyReservations";
import AddReservationEVOwner from "../pages/evowner/AddReservation";
import ViewEVOwnerReservations from "../pages/evowner/ViewEVOwnerReservations";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Wrap everything in MainLayout */}
      <Route path="/" element={<MainLayout />}>
        
        <Route index element={<Home />} />
        <Route path="/stations" element={<EVChargingStations />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/ev-owner" element={<EVOwnerLogin />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/register/ev-owner" element={<RegisterEVOwners />} />
        <Route path="/profile" element={<ProfileDetails />} />

        <Route path="/dashboard/add-ev-owners" element={<AddEVOwners />} />
        <Route path="/dashboard/view-ev-owners" element={<ViewEVOwners />} />
        <Route path="/dashboard/view-charging-station" element={<ViewChargeStations />} />
        <Route path="/dashboard/add-reservations" element={<AddReservation />} />
        <Route path="/dashboard/view-reservations" element={<ViewReservations />} />

        <Route path="/dashboard/add-charging-station" element={<AddChargeStation />} />
        <Route path="/dashboard/view-my-charging-station" element={<ViewMyChargeStations />} />
        <Route path="/dashboard/view-my-reservations" element={<ViewMyReservations />} />

        <Route path="/add-reservations" element={<AddReservationEVOwner />} />
        <Route path="/View-reservations" element={<ViewEVOwnerReservations />} />

      </Route>
    </Routes>
  );
}
