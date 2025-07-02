import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/api";
import { useUserStore } from "@/stores";
import { useMessage } from "@/hooks";
import { to } from "@/utils";

export function useLogin() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useUserStore();
	const { message } = useMessage();
	const { request } = useApi();

	const onFinish = async (values: any) => {
		setLoading(true);
		const [err, res] = await to(
			request("/auth/login", {
				method: "POST",
				data: {
					username: values.username,
					password: values.password,
				},
			})
		);
		setLoading(false);
		if (err) {
			console.error("登录错误:", err);
			return;
		}
		if (res) {
			if (res.data) {
				const { user, token } = res.data;
				login(user, token);
				message.success("登录成功！");
				setTimeout(() => {
					navigate("/dashboard");
				}, 500);
			} else {
				message.error("登录失败，请检查用户名和密码。");
			}
		}
		return true;
	};

	return {
		loading,
		onFinish,
	};
}
