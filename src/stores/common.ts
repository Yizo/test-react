import { create } from "zustand";

interface CommonState {
	loading: number;
	add: () => void;
	del: () => void;
}

export const useCommonStore = create<CommonState>()((set) => ({
	loading: 0,
	add: () => set((state) => ({ loading: state.loading + 1 })),
	del: () => set((state) => ({ loading: Math.max(state.loading - 1, 0) })),
}));
