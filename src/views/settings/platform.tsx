import { Card, Form, Input, Button, Row, Col, Space, Divider, Tag, Upload, message } from "antd";
import {
	SaveOutlined,
	ReloadOutlined,
	UploadOutlined,
	InfoCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { TextArea } = Input;

const PlatformSettings = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const handleSave = async (values: any) => {
		setLoading(true);
		try {
			// 模拟保存
			console.log("保存配置:", values);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			message.success("平台信息保存成功");
		} catch (error) {
			message.error("保存失败");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		form.resetFields();
		message.info("已重置为默认值");
	};

	const systemInfo = {
		version: "v2.1.0",
		buildTime: "2024-01-15 10:30:00",
		environment: "production",
		nodeVersion: "v18.16.0",
		uptime: "15天 8小时 30分钟",
	};

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">平台信息</h1>
				<p className="text-gray-600">配置系统基本信息和联系方式</p>
			</div>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={16}>
					<Card title="基本信息" className="mb-4">
						<Form
							form={form}
							layout="vertical"
							onFinish={handleSave}
							initialValues={{
								platformName: "前端监控平台",
								platformDescription: "专业的前端性能监控和错误追踪平台",
								companyName: "技术团队",
								contactEmail: "admin@example.com",
								supportPhone: "400-123-4567",
								officialWebsite: "https://monitor.example.com",
								copyright: "© 2024 前端监控平台. All rights reserved.",
							}}
						>
							<Row gutter={16}>
								<Col xs={24} sm={12}>
									<Form.Item
										label="平台名称"
										name="platformName"
										rules={[{ required: true, message: "请输入平台名称" }]}
									>
										<Input placeholder="请输入平台名称" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12}>
									<Form.Item
										label="公司名称"
										name="companyName"
										rules={[{ required: true, message: "请输入公司名称" }]}
									>
										<Input placeholder="请输入公司名称" />
									</Form.Item>
								</Col>
							</Row>

							<Form.Item
								label="平台描述"
								name="platformDescription"
								rules={[{ required: true, message: "请输入平台描述" }]}
							>
								<TextArea
									rows={3}
									placeholder="请输入平台描述"
									maxLength={200}
									showCount
								/>
							</Form.Item>

							<Row gutter={16}>
								<Col xs={24} sm={12}>
									<Form.Item
										label="联系邮箱"
										name="contactEmail"
										rules={[
											{ required: true, message: "请输入联系邮箱" },
											{ type: "email", message: "邮箱格式不正确" },
										]}
									>
										<Input placeholder="请输入联系邮箱" />
									</Form.Item>
								</Col>
								<Col xs={24} sm={12}>
									<Form.Item label="客服电话" name="supportPhone">
										<Input placeholder="请输入客服电话" />
									</Form.Item>
								</Col>
							</Row>

							<Form.Item
								label="官方网站"
								name="officialWebsite"
								rules={[{ type: "url", message: "请输入正确的网址格式" }]}
							>
								<Input placeholder="https://example.com" />
							</Form.Item>

							<Form.Item label="版权信息" name="copyright">
								<TextArea
									rows={2}
									placeholder="请输入版权信息"
									maxLength={100}
									showCount
								/>
							</Form.Item>

							<Divider />

							<Form.Item label="平台Logo">
								<Upload
									name="logo"
									listType="picture-card"
									className="avatar-uploader"
									showUploadList={false}
									beforeUpload={() => false}
								>
									<div>
										<UploadOutlined />
										<div style={{ marginTop: 8 }}>上传Logo</div>
									</div>
								</Upload>
								<p className="text-gray-500 text-sm mt-2">
									支持 JPG、PNG 格式，建议尺寸 120x40px
								</p>
							</Form.Item>

							<Form.Item>
								<Space>
									<Button
										type="primary"
										htmlType="submit"
										loading={loading}
										icon={<SaveOutlined />}
									>
										保存设置
									</Button>
									<Button icon={<ReloadOutlined />} onClick={handleReset}>
										重置
									</Button>
								</Space>
							</Form.Item>
						</Form>
					</Card>
				</Col>

				<Col xs={24} lg={8}>
					<Card
						title={
							<>
								<InfoCircleOutlined className="mr-2" />
								系统信息
							</>
						}
					>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-gray-600">系统版本:</span>
								<Tag color="blue">{systemInfo.version}</Tag>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">构建时间:</span>
								<span className="text-sm">{systemInfo.buildTime}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">运行环境:</span>
								<Tag color="green">{systemInfo.environment}</Tag>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Node版本:</span>
								<span className="text-sm">{systemInfo.nodeVersion}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">运行时长:</span>
								<span className="text-sm">{systemInfo.uptime}</span>
							</div>
						</div>
					</Card>

					<Card title="快速操作" className="mt-4">
						<Space direction="vertical" className="w-full">
							<Button block>检查系统更新</Button>
							<Button block>重启系统服务</Button>
							<Button block>清理系统缓存</Button>
							<Button block type="primary" ghost>
								下载系统日志
							</Button>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default PlatformSettings;
