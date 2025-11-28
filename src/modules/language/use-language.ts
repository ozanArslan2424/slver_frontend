import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import "dayjs/locale/en";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import type { TUnknownObject } from "@/lib/helper.type";

type DInput = dayjs.ConfigType;

export function useLanguage(ns?: string) {
	const { t, i18n } = useTranslation(ns);
	dayjs.extend(advancedFormat);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(isBetween);
	dayjs.extend(relativeTime);
	dayjs.locale(i18n.language);

	const timestamp = (date?: DInput) => ({
		now: dayjs(new Date()),
		iso: dayjs(date).toISOString(),
		fromNow: dayjs(date).fromNow(),
		shortDate: dayjs(date).format("DD.MM.YYYY"),
		short: dayjs(date).format("DD MMM YYYY"),
		long: dayjs(date).format("DD MMMM YYYY"),
		dateTimeNumber: dayjs(date).format("DD.MM.YYYY HH:mm"),
		dateTimeShort: dayjs(date).format("DD MMM YYYY HH:mm"),
		dateTimeLong: dayjs(date).format("DD MMMM YYYY HH:mm"),
		ordinalDateTime: dayjs(date).format("Do [of] MMMM, [at] HH:mm"),
		ordinalDate: dayjs(date).format("Do [of] MMMM"),
		date: dayjs(date).format("YYYY-MM-DD"),
		numberInMonth: dayjs(date).format("D"),
		numberInWeek: dayjs(date).format("d"),
		shortName: dayjs(date).format("ddd"),
		name: dayjs(date).format("dddd"),
		time: dayjs(date).format("HH:mm"),
		hour: dayjs(date).format("H"),
		minute: dayjs(date).format("m"),
		second: dayjs(date).format("s"),
		custom: (format: string) => dayjs(date).format(format),
	});

	const compareTime = (date: DInput) => ({
		before: (compare: DInput) => dayjs(date).isBefore(compare),
		after: (compare: DInput) => dayjs(date).isAfter(compare),
		between: (start: DInput, end: DInput) => dayjs(date).isBetween(start, end),
		same: (compare: DInput) => dayjs(date).isSame(compare),
	});

	const makeTranslator = (ns: string) => (key: string, opts?: TUnknownObject) =>
		t(key, { ns, ...opts });

	return {
		t,
		makeTranslator,
		i18n,
		timestamp,
		compareTime,
	};
}
