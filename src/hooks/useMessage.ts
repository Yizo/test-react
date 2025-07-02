import { message, notification, Modal } from "antd";

const MessageConfig = {
	initialized: false,
	init() {
		if (this.initialized) return;

		message.config({
			duration: 1.5,
			maxCount: 2,
			top: "16px",
		});

		notification.config({
			duration: 3,
		});

		this.initialized = true;
	},
};

export function useMessage() {
	MessageConfig.init();
	return { message, notification, modal: Modal };
}
