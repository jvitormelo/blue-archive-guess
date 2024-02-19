import { Navbar } from "@/components/navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto lg:p-5 p-3">
        <Outlet />
      </main>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
