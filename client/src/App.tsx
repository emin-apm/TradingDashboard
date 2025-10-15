import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const MarketPlacePage = lazy(() => import("./pages/MarketPlacePage"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      //errorElement: <ErrorPage>
      children: [
        { index: true, element: <HomePage /> },
        { path: "/dashboard", element: <DashboardPage /> },
        { path: "marketplace", element: <MarketPlacePage /> },
      ],
    },
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
