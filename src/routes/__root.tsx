import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <main className="max-w-7xl mx-auto p-5">
        <Outlet />
      </main>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
