import type { StringBoolean } from "@/lib/helper.type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isObjectWith<T extends Record<string, unknown>>(
	item: unknown,
	key: keyof T | string,
): item is T {
	return !!item && typeof item === "object" && key in item;
}

export function isObjectWithPath<T extends Record<string, unknown>>(
	item: unknown,
	...path: string[]
): item is T {
	if (!item || typeof item !== "object") return false;

	let current = item as Record<string, unknown>;

	for (const key of path) {
		if (!(key in current)) return false;
		if (typeof current[key] !== "object" || current[key] === null) {
			return false;
		}
		current = current[key] as Record<string, unknown>;
	}

	return true;
}

export function repeat(length: number = 4) {
	return Array.from({ length }, (_, index) => index);
}

export function prefixId(id: number | string, prefix?: string): string {
	if (prefix) {
		return `${prefix}_${id}`;
	}

	return id.toString().split("_")[1] as string;
}

export function isValidIndex(
	index: number,
	collection?: Array<unknown> | Set<unknown> | Map<unknown, unknown>,
): boolean {
	if (Number.isNaN(index)) return false;
	if (!Number.isInteger(index)) return false;
	if (index < 0) return false;
	if (collection) {
		const length =
			collection instanceof Set
				? collection.size
				: collection instanceof Map
					? collection.size
					: collection.length;
		return index < length;
	}
	return true;
}

export function getNextIndex(
	input: number,
	collection: Array<unknown>,
	loop: boolean = true,
): number {
	const min = 0;
	const max = collection.length - 1;
	if (input > max) return loop ? min : max;
	if (input < min) return loop ? max : min;
	return input;
}

export const toBoolean = (v?: StringBoolean | boolean): boolean =>
	typeof v === "boolean" ? v : v === "true";

export const toStringBoolean = (v?: boolean | StringBoolean): StringBoolean =>
	toBoolean(v) ? "true" : "false";
