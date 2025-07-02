import { Card, Row, Col, Button, List } from "antd";
import {
	SettingOutlined,
	GlobalOutlined,
	SafetyOutlined,
	DatabaseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SystemSettings = () => {
	const navigate = useNavigate();

	const settingsModules = [
		{
			key: "platform",
			title: "平台信息",
			description: "系统基本信息配置、版本信息、联系方式等",
			icon: <SettingOutlined className="text-2xl text-blue-500" />,
			path: "/settings/platform",
		},
		{
			key: "i18n",
			title: "国际化",
			description: "多语言支持、时区设置、日期格式等",
			icon: <GlobalOutlined className="text-2xl text-green-500" />,
			path: "/settings/i18n",
		},
		{
			key: "auth",
			title: "登录认证",
			description: "SSO配置、LDAP集成、密码策略等",
			icon: <SafetyOutlined className="text-2xl text-orange-500" />,
			path: "/settings/auth",
		},
		{
			key: "storage",
			title: "日志与存储",
			description: "日志保留策略、存储配置、备份设置等",
			icon: <DatabaseOutlined className="text-2xl text-purple-500" />,
			path: "/settings/storage",
		},
	];

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">系统设置</h1>
				<p className="text-gray-600">管理系统各项配置和参数</p>
			</div>

			<Row gutter={[16, 16]}>
				{settingsModules.map((module) => (
					<Col xs={24} sm={12} lg={8} key={module.key}>
						<Card
							hoverable
							className="h-full cursor-pointer"
							onClick={() => navigate(module.path)}
							bodyStyle={{ padding: "24px" }}
						>
							<div className="flex flex-col items-center text-center">
								<div className="mb-4">{module.icon}</div>
								<h3 className="text-lg font-semibold mb-2">{module.title}</h3>
								<p className="text-gray-500 text-sm mb-4">{module.description}</p>
								<Button type="link" size="small">
									进入配置 →
								</Button>
							</div>
						</Card>
					</Col>
				))}
			</Row>

			<Card title="快速设置" className="mt-6">
				<List
					itemLayout="horizontal"
					dataSource={[
						{
							title: "检查系统状态",
							description: "检查各项服务运行状态",
							action: "检查",
						},
						{
							title: "备份系统配置",
							description: "导出当前系统配置",
							action: "备份",
						},
						{
							title: "恢复系统配置",
							description: "从备份文件恢复配置",
							action: "恢复",
						},
						{
							title: "重置系统设置",
							description: "将系统设置恢复为默认值",
							action: "重置",
						},
					]}
					renderItem={(item) => (
						<List.Item
							actions={[
								<Button key="action" size="small">
									{item.action}
								</Button>,
							]}
						>
							<List.Item.Meta title={item.title} description={item.description} />
						</List.Item>
					)}
				/>
			</Card>
		</div>
	);
};

export default SystemSettings;
