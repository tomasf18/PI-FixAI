import { Route, Routes } from "react-router-dom";
import {
    ServiceHomePage,
    ServiceIncidentDetailsPage,
    LandingPage,
    LoginPage,
    ServiceIncidentsMapPage
} from "../pages";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* TODO: Private Routes */}
      {/* <Route element={<PrivateRoute/>}> */}

        {/* Service Routes Group */}
        <Route path="/service">
          <Route path="home" element={<ServiceHomePage />} />
          <Route path="incident-details/:incidentId" element={<ServiceIncidentDetailsPage />} />
          <Route path="incidents-map" element={<ServiceIncidentsMapPage />} />
        </Route>

      {/* </Route> */}
       
    </Routes>
  );
}
