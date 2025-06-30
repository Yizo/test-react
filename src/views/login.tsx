import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { fetcher } from "@/utils";

function fetchLogin(username: string, password: string) {
	return fetcher("/auth/login", {
		method: "POST",
		data: {
			username,
			password,
		},
	});
}

const Login: React.FC = () => {
	const [loading, setLoading] = useState(false);

	const onFinish = (values: any) => {
		setLoading(true);
		fetchLogin(values.username, values.password)
			.then((res) => {
				if (res.ok) {
					message.success("登录成功！");
				} else {
					message.error("登录失败，请检查用户名和密码。");
				}
				setLoading(false);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				background: "#f5f5f5",
			}}
		>
			<div
				style={{
					width: 360,
					padding: 32,
					background: "#fff",
					borderRadius: 8,
					boxShadow: "0 2px 8px #f0f1f2",
				}}
			>
				<h2 style={{ textAlign: "center", marginBottom: 24 }}>登录</h2>
				<Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
					<Form.Item
						name="username"
						rules={[{ required: true, message: "请输入用户名!" }]}
					>
						<Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
					</Form.Item>
					<Form.Item name="password" rules={[{ required: true, message: "请输入密码!" }]}>
						<Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							block
							size="large"
							loading={loading}
						>
							登录
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default Login;
