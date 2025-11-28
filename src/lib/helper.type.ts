import type { Icon, IconProps } from "@tabler/icons-react";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type TMaybe<T> = T | null | undefined;

export type TUnknownObject = Record<string, unknown>;

export type TWithId = TUnknownObject & { id: string | number };

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type Resolve<F, S> = S extends undefined ? F : Prettify<F & S>;

export type TAppIcon =
	| ForwardRefExoticComponent<Omit<IconProps, "ref"> & RefAttributes<Icon>>
	| ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

export type StringBoolean = "true" | "false";
