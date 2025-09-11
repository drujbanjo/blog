import { FC, ReactNode } from "react"

import { cn } from "@/lib"

type Props = {
	size?: "sm" | "md" | "lg"
	children?: ReactNode
}

export const Container: FC<Props> = ({ children, size = "md" }) => {
	const width = size === "sm" ? "max-w-[1080px]" : size === "md" ? "max-w-7xl" : "max-w-[1480px]"

	return <div className={cn("mx-auto w-full", width)}>{children}</div>
}
