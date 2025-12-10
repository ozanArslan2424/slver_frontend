export const apiRoutes = {
	auth: {
		me: "/auth/me",
		login: "/auth/login",
		register: "/auth/register",
		logout: "/auth/logout",
		refresh: "/auth/refresh",
	},
	group: {
		get: "/group",
		create: "/group",
		list: "/group/person-list",
		join: "/group/join",
		invite: "/group/invite",
		remove: "/group/remove",
	},
	thing: {
		list: "/thing",
		create: "/thing",
		update: "/thing/update",
		remove: "/thing/remove",
		assign: "/thing/assign",
		done: "/thing/done",
	},
	seenStatus: {
		count: "/seen-status/count",
	},
};
