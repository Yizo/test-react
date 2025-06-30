import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import router from "./routes";

const App = () => {
	return <RouterProvider router={router} />;
};

const themeConfig = {
	token: {
		colorPrimary: "#1677ff",
	},
};

// 渲染应用
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<ConfigProvider theme={themeConfig}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</ConfigProvider>
	);
}
