import { Skeleton } from "@/components/ui/skeleton";
import type { UseDndReturn } from "@/hooks/use-dnd";
import { repeat, prefixId, cn } from "@/lib/utils";
import { ErrorCard } from "@/components/ui/error-card";
import type { UseThingModuleReturn } from "@/modules/thing/use-thing-module";
import { ThingCard } from "@/components/thing-card";
import type { ThingData } from "@/modules/thing/thing.schema";
import type { ComponentProps } from "react";

type ThingListProps = {
	thingModule: UseThingModuleReturn;
	dnd: UseDndReturn;
	variant: "done" | "notDone";
	cardProps: (thing: ThingData) => ComponentProps<"div">;
};

export function ThingList({ thingModule, cardProps, dnd, variant }: ThingListProps) {
	const listQuery = thingModule.listQuery;
	const handleOpenDetailModal = thingModule.handleOpenDetailModal;

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
				.filter((t) => (variant === "done" ? t.isDone : !t.isDone))
				// .sort(thingModule.handleSortByDate)
				.map((thing, index) => {
					const id = prefixId(thing.id, "thing");
					const delay = index * 100;
					const props = cardProps(thing);
					return (
						<ThingCard
							key={id}
							thing={thing}
							{...props}
							{...dnd.registerSource({ sourceId: id })}
							{...dnd.registerTarget({ targetId: id })}
							className={cn(
								variant === "done" && "opacity-70 hover:opacity-100",
								dnd.getIsOver(id) && "border-primary",
								props.className,
							)}
							onClick={() => handleOpenDetailModal(thing.id)}
							style={{ animationDelay: `${delay}ms` }}
						/>
					);
				})}
		</div>
	);
}
