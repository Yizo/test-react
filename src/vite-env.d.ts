/// <reference types="vite/client" />

declare global {
	interface Window {
		$wujie?: {
			bus?: {
				$emit: (event: string, data?: any) => void;
			};
		};
	}
}
