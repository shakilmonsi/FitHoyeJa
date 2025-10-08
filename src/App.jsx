import React from "react";
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./router/AppRoutes";
import AuthProvider from "./context/AuthContext/AuthProvider";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./context/NotificationContext/NotificationContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <React.StrictMode>
      <NotificationProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <RouterProvider router={AppRoutes} />
          </AuthProvider>
        </LanguageProvider>
      </NotificationProvider>
    </React.StrictMode>
  );
}

export default App;
