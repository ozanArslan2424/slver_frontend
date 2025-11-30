import { Skeleton } from "@/components/ui/skeleton";
import type { UseDndReturn } from "@/hooks/use-dnd";
import { cn, prefixId, repeat } from "@/lib/utils";
import { ErrorCard } from "@/components/ui/error-card";
import type { UseKeyboardModuleReturn } from "@/modules/keyboard/use-keyboard-module";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import { Status } from "@/modules/person/person.schema";
import { useAppContext } from "@/app";

type PersonListProps = {
	personModule: UsePersonModuleReturn;
	keyboardModule: UseKeyboardModuleReturn;
	dnd: UseDndReturn;
};

export function PersonList({ personModule, keyboardModule, dnd }: PersonListProps) {
	const { store } = useAppContext();
	if (personModule.listQuery.isPending) {
		return (
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{repeat().map((i) => (
					<Skeleton
						key={i}
						className="border-border/70 hover:border-primary animate_down flex aspect-square size-full cursor-grab flex-col overflow-hidden rounded-md border outline-4 outline-transparent transition-all active:cursor-grabbing"
					>
						<Skeleton className="bg-card text-card-foreground pointer-events-none flex size-full items-center justify-center text-xl font-black capitalize no-underline select-none" />
					</Skeleton>
				))}
			</div>
		);
	}

	if (personModule.listQuery.error) {
		return <ErrorCard error={personModule.listQuery.error} />;
	}

	if (personModule.listQuery.data.length === 0) {
		return (
			<div className="card">
				<article className="text-foreground/70 text-center text-sm font-bold">
					{personModule.t("noLength")}
				</article>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
			{personModule.listQuery.data.map((person, index) => {
				const id = prefixId(person.id, "person");
				const delay = (index + 2) * 50;
				const initials = person.name
					.split(" ")
					.map((p) => p[0].toLocaleUpperCase())
					.slice(0, 2)
					.join("");
				const status = person.memberships.find((m) => m.groupId === store.get("groupId"))?.status;
				return (
					<div
						key={id}
						{...keyboardModule.register(id)}
						{...dnd.registerSource({ sourceId: id })}
						onClick={() => personModule.handleAction(person)}
						style={{
							animationDelay: `${delay}ms`,
						}}
						className={cn(
							"relative",
							"hover:border-primary animate_down aspect-square cursor-grab overflow-hidden rounded-md border border-transparent outline-2 outline-offset-2 outline-transparent transition-all active:cursor-grabbing",
							keyboardModule.getIsFocused(id) && "outline-ring",
							"h-full w-full",
						)}
					>
						{status === Status.pending && (
							<div className="absolute top-0 left-0 w-full truncate bg-amber-200 p-1 text-center text-xs font-semibold whitespace-nowrap text-black dark:bg-amber-600">
								{personModule.t("memberPending")}
							</div>
						)}

						<div className="aspect-square flex-1">
							{person.image ? (
								<img className="size-full" src={person.image} alt={person.name} />
							) : (
								<div className="bg-card text-card-foreground pointer-events-none flex size-full items-center justify-center text-xl font-black capitalize no-underline select-none">
									{initials}
								</div>
							)}
						</div>

						<div className="bg-secondary absolute bottom-0 left-0 w-full truncate p-1 text-center text-xs font-semibold whitespace-nowrap">
							{person.name}
						</div>
					</div>
				);
			})}
		</div>
	);
}
