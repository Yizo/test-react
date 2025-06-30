import React from "react";
import { Outlet, Link } from "react-router-dom";

export const Layout = () => (
	<div>
		<Link to="/">Home</Link>
		<Link to="/users" className="ml-4">
			Users
		</Link>
		<Outlet />
	</div>
);

export const Home = () => <h1>Home</h1>;
export const Users = () => <h1>Users</h1>;
export const UserDetail = () => <h1>User Detail</h1>;
