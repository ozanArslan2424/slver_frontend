import { cn } from "@/lib/utils";
import { useLanguage } from "@/modules/language/use-language";
import { Status, type PersonData } from "@/modules/person/person.schema";
import type { ComponentProps } from "react";

type PersonCardProps = ComponentProps<"div"> & {
	person: PersonData;
	status?: Status;
};

export function PersonCard({ person, status, ...rest }: PersonCardProps) {
	const { t } = useLanguage("person");
	const initials = person.name
		.split(" ")
		.map((p) => p[0].toLocaleUpperCase())
		.slice(0, 2)
		.join("");
	return (
		<div
			{...rest}
			className={cn(
				"relative aspect-square h-full w-full overflow-hidden rounded-md border border-transparent transition-all",
				rest.className,
			)}
		>
			{status !== undefined && status === Status.pending && (
				<div className="absolute top-0 left-0 w-full truncate bg-amber-200 p-1 text-center text-xs font-semibold whitespace-nowrap text-black dark:bg-amber-600">
					{t("memberPending")}
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
}
