import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "@/views/login";

const router = createBrowserRouter(
	[
		{
			path: `/login`,
			element: <Login />,
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
