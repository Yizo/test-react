// logs模块模拟数据和类型
export interface OperationLog {
	id: string;
	operatorName: string;
	operatorId: string;
	operationType: string;
	targetType: string;
	targetName: string;
	targetId: string;
	operationTime: string;
	ipAddress: string;
	userAgent: string;
	operationDetail: string;
	result: "success" | "failed";
	errorMsg?: string;
}

export const mockLogs: OperationLog[] = [
	{
		id: "1",
		operatorName: "张三",
		operatorId: "user_001",
		operationType: "创建应用",
		targetType: "应用",
		targetName: "官网前端",
		targetId: "app_web_001",
		operationTime: "2024-01-20 14:30:00",
		ipAddress: "192.168.1.100",
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		operationDetail: "创建新应用：官网前端，AppKey: app_web_001",
		result: "success",
	},
	{
		id: "2",
		operatorName: "李四",
		operatorId: "user_002",
		operationType: "编辑配置",
		targetType: "监控配置",
		targetName: "移动端监控配置 v1.1.0",
		targetId: "config_002",
		operationTime: "2024-01-20 10:15:00",
		ipAddress: "192.168.1.101",
		userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
		operationDetail: "修改采样率从100%调整为80%，关闭行为监控",
		result: "success",
	},
	{
		id: "3",
		operatorName: "王五",
		operatorId: "user_003",
		operationType: "删除告警规则",
		targetType: "告警规则",
		targetName: "高响应时间",
		targetId: "alert_rule_003",
		operationTime: "2024-01-18 09:30:00",
		ipAddress: "192.168.1.102",
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		operationDetail: "删除高响应时间告警规则",
		result: "failed",
		errorMsg: "无权限操作",
	},
];
