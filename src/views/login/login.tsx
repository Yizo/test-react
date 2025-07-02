import React from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useLogin } from "./login.utl";

const Login: React.FC = () => {
	console.log("login render");

	const { loading, onFinish } = useLogin();

	return (
		<div className="flex h-screen justify-center pt-[20vh] bg-gray-100">
			<div className="w-[400px] h-[300px] p-8 bg-white rounded-lg shadow-lg">
				<h2 className="text-center mb-6 text-2xl font-semibold">登录</h2>
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
