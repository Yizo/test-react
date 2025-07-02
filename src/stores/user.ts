import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export interface UserInfo {
	id?: string;
	username?: string;
	name?: string;
	avatar?: string;
	roles?: string[];
	permissions?: string[];
}

interface UserState {
	userInfo: UserInfo | null;
	token: string | null;
	isLoggedIn: boolean;
	setUserInfo: (userInfo: UserInfo) => void;
	setToken: (token: string) => void;
	login: (userInfo: UserInfo, token: string) => void;
	logout: () => void;
	getToken: () => string | null;
}

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			userInfo: null,
			token: null,
			isLoggedIn: false,

			setUserInfo: (userInfo: UserInfo) => {
				set({
					userInfo,
					isLoggedIn: !!userInfo,
				});
			},

			setToken: (token: string) => {
				// 设置到cookie
				Cookies.set("token", token, { expires: 7 });
				set({ token });
			},

			getToken: () => {
				const state = get();
				// 优先从state获取，如果没有则从cookie获取
				return state.token || Cookies.get("token") || null;
			},

			login: (userInfo: UserInfo, token: string) => {
				// 设置token到cookie
				Cookies.set("token", token, { expires: 7 });
				set({
					userInfo,
					token,
					isLoggedIn: true,
				});
			},

			logout: () => {
				// 清除cookie
				Cookies.remove("token");
				set({
					userInfo: null,
					token: null,
					isLoggedIn: false,
				});
			},
		}),
		{
			name: "user-store",
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
