import { useDialog } from "@/hooks/use-dialog";
import { type ReactNode } from "react";

export type EntityAction = {
	key: string;
	label: ReactNode;
	onSelect: (key: string) => void;
};

type UseActionDialogArgs = {
	title?: string;
	description?: string;
	className?: string;
	actions: EntityAction[];
};

export type UseActionDialogReturn = Omit<ReturnType<typeof useActionDialog>, "actions"> & {
	actions: EntityAction[];
};

export function useActionDialog(args: UseActionDialogArgs) {
	const dialog = useDialog();
	return { ...args, ...dialog };
}
