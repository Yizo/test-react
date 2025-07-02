import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "@ant-design/v5-patch-for-react-19";
import router from "./routes";
import "virtual:uno.css";
import "antd/dist/reset.css";
import "./index.css";

dayjs.locale("zh-cn");

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
		<ConfigProvider theme={themeConfig} locale={zhCN}>
			<React.StrictMode>
				<App className={"h-full"}>
					<RouterProvider router={router} />
				</App>
			</React.StrictMode>
		</ConfigProvider>
	);
}
