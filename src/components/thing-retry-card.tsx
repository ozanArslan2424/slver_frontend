import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { useMemo } from "react";

type ThingDoneCardProps = {
	thingModule: UseThingModuleReturn;
};

export function ThingRetryCard({ thingModule }: ThingDoneCardProps) {
	const createMutation = thingModule.createMutation;
	const updateMutation = thingModule.updateMutation;

	const config = useMemo(() => {
		if (createMutation.isError) {
			return {
				variant: "create",
				retry: () => {
					createMutation.mutate(createMutation.variables);
				},
			};
		}
		if (updateMutation.isError) {
			return {
				variant: "create",
				retry: () => {
					updateMutation.mutate(updateMutation.variables);
				},
			};
		}

		return null;
	}, [createMutation, updateMutation]);

	if (config === null) return null;

	return (
		<button
			onClick={config.retry}
			className="unset rounded-md bg-rose-500/10 px-5 py-2 text-center text-sm font-semibold text-red-600 hover:bg-rose-500/5"
		>
			{thingModule.t(`retry.${config.variant}`)}
		</button>
	);
}
