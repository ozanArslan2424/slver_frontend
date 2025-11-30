import { useModal } from "@/hooks/use-dialog";
import { prefixId } from "@/lib/utils";
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
	const { id, ...dialog } = useModal();
	return { ...args, ...dialog, id: prefixId(id, "action") };
}
