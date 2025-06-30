import { createContext, useContext, useState } from "react";

export function useStampContent() {
	const [stampContent, setStampContent] = useState(null);

	function createStampContent() {
		createContext(stampContent);
	}

	return { createStampContent };
}
