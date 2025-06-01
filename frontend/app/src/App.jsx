import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import TopMenu from './components/TopMenu';
import SignupFormPage from './pages/auth/SignupFormPage';
import SignInFormPage from './pages/auth/SignInFormPage';
import AccountPage from './pages/AccountPage';
import CarListPage from './pages/CarListPage';
import ManagerPanelPage from './pages/ManagerPanelPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AddCarPage from './pages/AddCarPage';
import EditCarPage from './pages/EditCarPage';
import CarInfoPage from './pages/CarInfoPage';
import AdditionalServicesPage from './pages/AdditionalServicesPage';
import DiscountsPage from './pages/DiscountsPage';
import Footer from './components/Footer';
import RentalPage from './pages/RentalPage';
import AdminPanelPage from './pages/AdminPanelPage';
import UsersPage from './pages/UsersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LogPage from './pages/LogPage';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <TopMenu />
            <Box sx={{ flex: 1, mb: 4, mt: 3 }}>
              <Routes>
                <Route path="/signup" element={<SignupFormPage />} />
                <Route path="/signin" element={<SignInFormPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/add-car" element={<AddCarPage />} />
                <Route path="/edit-car/:id" element={<EditCarPage />} />
                <Route path="/car-info/:id" element={<CarInfoPage />} />
                <Route path="/" element={<CarListPage />} />

                <Route element={<ProtectedRoute allowedRoles={['ROLE_MANAGER']} />}>
                  <Route path="/manager" element={<ManagerPanelPage />} />
                  <Route path="/additional-services" element={<AdditionalServicesPage />} />
                  <Route path="/discounts" element={<DiscountsPage />} />
                  <Route path="/rentals" element={<RentalPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                  <Route path="/admin" element={<AdminPanelPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/logs" element={<LogPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;