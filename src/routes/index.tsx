import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/views/login/login";
import Dashboard from "@/views/dashboard";
import UserManagement from "@/views/user-management";
import MenuManagement from "@/views/menu-management";
import RoleManagement from "@/views/role-management";
import AppLayout from "@/components/Layout";
import AuthGuard from "@/components/AuthGuard";

const router = createBrowserRouter(
	[
		{
			path: `/login`,
			element: <Login />,
		},
		{
			path: "/",
			element: (
				<AuthGuard>
					<AppLayout />
				</AuthGuard>
			),
			children: [
				{
					path: "",
					index: true,
					element: <Navigate to="/dashboard" replace />,
				},
				{
					path: "dashboard",
					element: <Dashboard />,
				},
				{
					path: "user-management",
					element: <UserManagement />,
				},
				{
					path: "menu-management",
					element: <MenuManagement />,
				},
				{
					path: "role-management",
					element: <RoleManagement />,
				},
			],
		},
		{
			path: "*",
			element: <Navigate to="/login" replace />,
		},
	],
	{
		basename: import.meta.env.VITE_BASE_URL || "/",
	}
);

export default router;
