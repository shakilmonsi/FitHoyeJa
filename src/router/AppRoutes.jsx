import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import About from "../pages/about/About";
import MainLayout from "../MainLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Contact from "../pages/contact/Contact";
import TermAndCondition from "../pages/termAndCondition/TermAndCondition";
import AdDetailPage from "../pages/adDetails/AdDetailPage";
import AdUpload from "../pages/adUpload/AdUpload";
import MyAds from "../pages/myAds/MyAds";
import MyArchive from "../pages/myArchive/MyArchive";
import ProtectedRoute from "../authente/AuthProvideer/ProtectedRoute";
import BuyCredits from "../pages/BuyCredits/BuyCredits";
import Setting from "../pages/settings/Setting";
import Agent from "../pages/agent/Agent";
import PublicRoute from "../authente/AuthProvideer/PublicRoute";
import Sitemap from "../pages/sitemap/Sitemap";
import ResetPassword from "../pages/auth/ResetPassword";
import ChatListPage from "../pages/ChatListPage";
import PrivateChatPage from "../pages/PrivateChatPage";
import NotificationCenter from "../pages/NotificationPage/NotificationCenter";
import NOtificationDemo from "../pages/NotificationPage/demo/NOtificationDemo";
import SearchResults from "../pages/search/SearchResults";
import { Home } from "../pages/home/Home";
import AgentsDetails from "../pages/propertyDetails/AgentsDetails";
import CompanyAdsPage from "../testingCode/AgentDetailsPage/CompanyAdsPage";
const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchResults />,
      },
      {
        path: "ads/:slug",
        element: <AdDetailPage />,
      },
      {
        path: "agent/:companyId/ads",
        element: <CompanyAdsPage />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "sitemap",
        element: <Sitemap></Sitemap>,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "terms",
        element: <TermAndCondition />,
      },

      {
        path: "agents",
        element: <Agent />,
      },

      {
        path: "chats",
        element: <ChatListPage />,
      },
      {
        path: "notification",
        element: <NotificationCenter />,
      },
      {
        path: "demonoitfication",
        element: <NOtificationDemo />,
      },

      {
        path: "chats/:chatId",
        element: <PrivateChatPage />,
      },

      {
        path: "reset-password",
        element: <ResetPassword />,
      },

      {
        path: "agents-details/:id",
        element: <AgentsDetails />,
      },

      {
        element: <PublicRoute />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "my-ads",
            element: <MyAds />,
          },
          {
            path: "ad-upload",
            element: <AdUpload />,
          },
          {
            path: "my-archives",
            element: <MyArchive />,
          },
          {
            path: "buy-credits",
            element: <BuyCredits />,
          },
          {
            path: "settings",
            element: <Setting />,
          },
        ],
      },
    ],
  },
]);

export { AppRoutes };
