import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";
import AppLayout from "@/components/Layout";

// 登录页面直接导入
import Login from "@/views/login/login";

// 直接导入所有页面组件
const Dashboard = lazy(() => import("@/views/dashboard/index"));
const Apps = lazy(() => import("@/views/apps/index"));
const AppsDetail = lazy(() => import("@/views/apps/detail"));
const Configs = lazy(() => import("@/views/configs/index"));
const ConfigsEdit = lazy(() => import("@/views/configs/edit"));
const ConfigsHistory = lazy(() => import("@/views/configs/history"));
const Alerts = lazy(() => import("@/views/alerts/index"));
const AlertsRules = lazy(() => import("@/views/alerts/rules"));
const AlertsChannels = lazy(() => import("@/views/alerts/channels"));
const AlertsHistory = lazy(() => import("@/views/alerts/history"));
const Members = lazy(() => import("@/views/members/index"));
const Roles = lazy(() => import("@/views/roles/index"));
const Logs = lazy(() => import("@/views/logs/index"));
const Analysis = lazy(() => import("@/views/analysis/index"));
const Plugins = lazy(() => import("@/views/plugins/index"));
const PluginsConfig = lazy(() => import("@/views/plugins/config"));
const Settings = lazy(() => import("@/views/settings/index"));
const SettingsPlatform = lazy(() => import("@/views/settings/platform"));
const SettingsI18n = lazy(() => import("@/views/settings/i18n"));
const SettingsAuth = lazy(() => import("@/views/settings/auth"));
const SettingsStorage = lazy(() => import("@/views/settings/storage"));

// 页面组件包装器
const PageWrapper = ({ Component }: { Component: React.ComponentType }) => (
	<Suspense
		fallback={
			<div className="flex justify-center items-center h-64">
				<Spin size="large" />
			</div>
		}
	>
		<Component />
	</Suspense>
);

const router = createBrowserRouter(
	[
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/",
			element: <AppLayout />,
			children: [
				{
					index: true,
					element: <Navigate to="/dashboard" replace />,
				},
				{
					path: "dashboard",
					element: <PageWrapper Component={Dashboard} />,
				},
				{
					path: "apps",
					children: [
						{
							index: true,
							element: <PageWrapper Component={Apps} />,
						},
						{
							path: ":id",
							element: <PageWrapper Component={AppsDetail} />,
						},
					],
				},
				{
					path: "configs",
					children: [
						{
							index: true,
							element: <PageWrapper Component={Configs} />,
						},
						{
							path: ":id",
							element: <PageWrapper Component={ConfigsEdit} />,
						},
						{
							path: "history",
							element: <PageWrapper Component={ConfigsHistory} />,
						},
					],
				},
				{
					path: "alerts",
					children: [
						{
							index: true,
							element: <PageWrapper Component={Alerts} />,
						},
						{
							path: "rules",
							element: <PageWrapper Component={AlertsRules} />,
						},
						{
							path: "channels",
							element: <PageWrapper Component={AlertsChannels} />,
						},
						{
							path: "history",
							element: <PageWrapper Component={AlertsHistory} />,
						},
					],
				},
				{
					path: "members",
					element: <PageWrapper Component={Members} />,
				},
				{
					path: "roles",
					element: <PageWrapper Component={Roles} />,
				},
				{
					path: "logs",
					element: <PageWrapper Component={Logs} />,
				},
				{
					path: "analysis",
					element: <PageWrapper Component={Analysis} />,
				},
				{
					path: "plugins",
					children: [
						{
							index: true,
							element: <PageWrapper Component={Plugins} />,
						},
						{
							path: "config",
							children: [
								{
									index: true,
									element: <PageWrapper Component={PluginsConfig} />,
								},
								{
									path: ":id",
									element: <PageWrapper Component={PluginsConfig} />,
								},
							],
						},
					],
				},
				{
					path: "settings",
					children: [
						{
							index: true,
							element: <PageWrapper Component={Settings} />,
						},
						{
							path: "platform",
							element: <PageWrapper Component={SettingsPlatform} />,
						},
						{
							path: "i18n",
							element: <PageWrapper Component={SettingsI18n} />,
						},
						{
							path: "auth",
							element: <PageWrapper Component={SettingsAuth} />,
						},
						{
							path: "storage",
							element: <PageWrapper Component={SettingsStorage} />,
						},
					],
				},
			],
		},
		{
			path: "*",
			element: <Navigate to="/dashboard" replace />,
		},
	],
	{
		basename: import.meta.env.VITE_BASE_URL || "/",
	}
);

export default router;
