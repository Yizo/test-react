import { createContext, useState } from "react";

export function useStampContent() {
	const [stampContent] = useState(null);

	function createStampContent() {
		createContext(stampContent);
	}

	return { createStampContent };
}
