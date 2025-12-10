import { Skeleton } from "@/components/ui/skeleton";
import type { UseDndReturn } from "@/hooks/use-dnd";
import { cn, prefixId, repeat } from "@/lib/utils";
import { ErrorCard } from "@/components/ui/error-card";
import type { UsePersonModuleReturn } from "@/modules/person/use-person-module";
import { type PersonData } from "@/modules/person/person.schema";
import { useAppContext } from "@/modules/context/app.context";
import { useLanguage } from "@/modules/language/use-language";
import type { ComponentProps } from "react";
import { PersonCard } from "@/components/person-card";

type PersonListProps = {
	personModule: UsePersonModuleReturn;
	dnd: UseDndReturn;
	cardProps: (person: PersonData) => ComponentProps<"div">;
};

export function PersonList({ personModule, dnd, cardProps }: PersonListProps) {
	const { t } = useLanguage("person");
	const { store } = useAppContext();
	const listQuery = personModule.listQuery;
	const handleOpenMenuModal = personModule.handleOpenDetailModal;

	if (listQuery.isPending) {
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

	if (listQuery.error) {
		return <ErrorCard error={listQuery.error} />;
	}

	if (listQuery.data.length === 0) {
		return (
			<div className="card">
				<article className="text-foreground/70 text-center text-sm font-bold">
					{t("noLength")}
				</article>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
			{listQuery.data.map((person, index) => {
				const id = prefixId(person.id, "person");
				const delay = (index + 2) * 50;
				const group = person.memberships.find((m) => m.groupId === store.get("groupId"));
				const props = cardProps(person);
				return (
					<PersonCard
						key={id}
						person={person}
						status={group?.status}
						{...props}
						{...dnd.registerSource({ sourceId: id })}
						onClick={() => handleOpenMenuModal(person.id)}
						style={{
							animationDelay: `${delay}ms`,
						}}
						className={cn(
							"hover:border-primary animate_down cursor-grab active:cursor-grabbing",
							props.className,
						)}
					/>
				);
			})}
		</div>
	);
}
