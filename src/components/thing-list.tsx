import { Skeleton } from "@/components/ui/skeleton";
import type { UseDndReturn } from "@/hooks/use-dnd";
import { repeat, prefixId, cn } from "@/lib/utils";
import { ErrorCard } from "@/components/ui/error-card";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { ThingCard } from "@/components/thing-card";

type ThingListProps = {
	thingModule: UseThingModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
	dnd: UseDndReturn;
	variant: "done" | "notDone";
};

export function ThingList({ thingModule, keyboardModule, dnd, variant }: ThingListProps) {
	const listQuery = thingModule.listQuery;
	const handleSortByDate = thingModule.handleSortByDate;
	const handleClick = thingModule.handleDetailClick;

	if (listQuery.isPending) {
		return (
			<div className="flex flex-col gap-3">
				{repeat().map((i) => (
					<Skeleton key={i} className="flex h-16 gap-4 border p-3">
						<Skeleton className="aspect-square h-10 w-10 shrink-0 rounded-full" />
						<Skeleton className="h-5 w-full" />
					</Skeleton>
				))}
			</div>
		);
	}

	if (listQuery.error) {
		return <ErrorCard error={listQuery.error} />;
	}

	return (
		<div className="flex flex-col gap-3">
			{listQuery.data
				.sort((a, b) => handleSortByDate(a, b, variant))
				.filter((t) => (variant === "done" ? t.isDone : !t.isDone))
				.map((thing, index) => {
					const id = prefixId(thing.id, "thing");
					const delay = index * 100;
					return (
						<ThingCard
							key={id}
							thing={thing}
							{...keyboardModule.getElementProps(id)}
							{...dnd.registerSource({ sourceId: id })}
							{...dnd.registerTarget({ targetId: id })}
							className={cn(
								"hover:border-primary",
								variant === "done" && "opacity-70 hover:opacity-100",
								keyboardModule.getIsFocused(id) && "outline-ring",
								dnd.getIsOver(id) && "border-primary",
							)}
							onClick={() => handleClick(thing)}
							style={{ animationDelay: `${delay}ms` }}
						/>
					);
				})}
		</div>
	);
}
