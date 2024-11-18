import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // Correct import
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { themeSettings } from "./core/theme/theme";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotAuthorized from "./pages/NotAuthorized";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import SummariesPage from "./pages/SummariesPage";
import SummaryDetailPage from "./pages/SummaryDetailPage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const isAuthenticated = useSelector((state) => state.accessToken != null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<LoginPage />}
          />
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <HomePage /> : <NotAuthorized />}
          />
          <Route
            path="/summaries"
            element={isAuthenticated ? <SummariesPage /> : <NotAuthorized />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <SettingsPage /> : <NotAuthorized />}
          />
          <Route
            path="/summaries/:id"
            element={
              isAuthenticated ? <SummaryDetailPage /> : <NotAuthorized />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
