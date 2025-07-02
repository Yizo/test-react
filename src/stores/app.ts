import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuItem {
	key: string;
	label: string;
	icon?: string;
	path?: string;
	index?: boolean;
	children?: MenuItem[];
}

interface AppState {
	collapsed: boolean;
	breadcrumbs: { title: string; path?: string }[];
	menus: MenuItem[];
	isDynamicMenu: boolean;
	setCollapsed: (collapsed: boolean) => void;
	setBreadcrumbs: (breadcrumbs: { title: string; path?: string }[]) => void;
	setMenus: (menus: MenuItem[]) => void;
	setIsDynamicMenu: (isDynamic: boolean) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			collapsed: false,
			breadcrumbs: [],
			menus: [],
			isDynamicMenu: import.meta.env.VITE_DYNAMIC_MENU === "true",

			setCollapsed: (collapsed: boolean) => {
				set({ collapsed });
			},

			setBreadcrumbs: (breadcrumbs: { title: string; path?: string }[]) => {
				set({ breadcrumbs });
			},

			setMenus: (menus: MenuItem[]) => {
				set({ menus });
			},

			setIsDynamicMenu: (isDynamic: boolean) => {
				set({ isDynamicMenu: isDynamic });
			},
		}),
		{
			name: "app-store",
			storage: {
				getItem: (name) => {
					const str = sessionStorage.getItem(name);
					if (!str) return null;
					return JSON.parse(str);
				},
				setItem: (name, value) => {
					sessionStorage.setItem(name, JSON.stringify(value));
				},
				removeItem: (name) => sessionStorage.removeItem(name),
			},
		}
	)
);
