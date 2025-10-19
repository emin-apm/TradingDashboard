import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { lazy, Suspense } from "react";
import WalletPage from "./pages/WalletPage";

const HomePage = lazy(() => import("./pages/HomePage"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      //errorElement: <ErrorPage>
      children: [
        { index: true, element: <HomePage /> },
        { path: "wallet", element: <WalletPage /> },
        { path: "marketoverview", element: <HomePage /> },
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
