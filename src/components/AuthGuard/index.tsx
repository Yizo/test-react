import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/stores";

interface AuthGuardProps {
	children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const { isLoggedIn, getToken } = useUserStore();
	const location = useLocation();

	// 检查登录状态
	const token = getToken();
	const isAuthenticated = isLoggedIn && token;

	if (!isAuthenticated) {
		// 保存当前路径，登录后可以重定向回来
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
};

export default AuthGuard;
