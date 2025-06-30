import { createBrowserRouter } from "react-router-dom";
import { Layout, Home, Users, UserDetail } from "@/views/login";
import Login from "./Login";

const router = createBrowserRouter([
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "users",
				element: <Users />,
			},
			{
				path: "users/:id",
				element: <UserDetail />,
				loader: async ({ params }) => {
					console.log(params);
					return [];
				},
			},
		],
	},
]);

export default router;
