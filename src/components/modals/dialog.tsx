import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DialogState } from "@/hooks/use-dialog";
import { useLanguage } from "@/modules/language/use-language";

const Root = DialogPrimitive.Root;
const Portal = DialogPrimitive.Portal;
const Overlay = DialogPrimitive.Overlay;
const Content = DialogPrimitive.Content;
const Title = DialogPrimitive.Title;
const Description = DialogPrimitive.Description;
const Close = DialogPrimitive.Close;

type DialogProps = DialogState & {
	id?: string;
	showCloseButton?: boolean;
	showTitle?: boolean;
	showDescription?: boolean;
	title: string;
	description: string;
	className?: string;
	children: React.ReactNode;
	closeButtonProps?: React.ComponentProps<"button">;
	autoFocus?: boolean;
};

export function Dialog({
	id,
	open,
	onOpenChange,
	defaultOpen,
	showCloseButton = true,
	showTitle = false,
	showDescription = false,
	title,
	description,
	className,
	children,
	closeButtonProps,
	autoFocus = false,
}: DialogProps) {
	const { t: tCommon } = useLanguage("common");

	return (
		<Root data-slot="dialog" open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
			<Portal data-slot="dialog-portal">
				<Overlay
					data-slot="dialog-overlay"
					className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
				/>
				<Content
					id={id}
					onOpenAutoFocus={autoFocus ? undefined : (e) => e.preventDefault()}
					tabIndex={-1}
					data-slot="dialog-content"
					className={cn(
						"bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-4 shadow-lg duration-200 sm:max-w-lg",
						"data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:animate-out data-[state=closed]:scale-0",
						"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-0 data-[state=open]:scale-100",
						className,
					)}
				>
					<div
						data-slot="dialog-header"
						className={cn(
							"flex flex-col gap-2 text-center sm:text-left",
							showTitle === true || showDescription === true ? "" : "sr-only",
						)}
					>
						<Title
							data-slot="dialog-title"
							className={cn("text-lg leading-none font-semibold", showTitle ? "" : "sr-only")}
						>
							{title}
						</Title>
						<Description
							data-slot="dialog-description"
							className={cn("text-muted-foreground text-sm", showDescription ? "" : "sr-only")}
						>
							{description}
						</Description>
					</div>

					{children}
					{showCloseButton && (
						<Close asChild>
							<button
								data-slot="dialog-close"
								{...closeButtonProps}
								className={cn(
									"absolute top-2 right-2 p-1.5",
									"square ghost h-6 w-6",
									"ring-offset-background focus:ring-ring focus:ring-2 focus:ring-offset-2",
									"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
									closeButtonProps?.className,
								)}
							>
								{closeButtonProps?.children ? closeButtonProps.children : <XIcon />}
								<span className="sr-only">{tCommon("close")}</span>
							</button>
						</Close>
					)}
				</Content>
			</Portal>
		</Root>
	);
}
