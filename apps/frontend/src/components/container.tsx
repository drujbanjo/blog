import { FC, ReactNode } from "react"

export const Container: FC<{ children?: ReactNode }> = ({ children }) => {
	return <div className="mx-auto w-full max-w-[1480px]">{children}</div>
}
