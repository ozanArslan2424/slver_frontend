import type { TMaybe } from "@/lib/helper.type";
import { cn } from "@/lib/utils";

export function PersonAvatar<
	T extends {
		name: string;
		image?: TMaybe<string>;
	},
>({ person, className }: { person: T; className?: string }) {
	const initials = person.name
		.split(" ")
		.map((p) => p[0].toLocaleUpperCase())
		.slice(0, 2)
		.join("");

	return (
		<div
			className={cn(
				"relative flex h-10 w-10 shrink-0 overflow-hidden rounded-md text-sm",
				className,
			)}
		>
			{person.image ? (
				<img className="aspect-square size-full" src={person.image} alt={person.name} />
			) : (
				<div className="bg-card text-card-foreground pointer-events-none flex size-full items-center justify-center capitalize no-underline select-none">
					{initials}
				</div>
			)}
		</div>
	);
}
