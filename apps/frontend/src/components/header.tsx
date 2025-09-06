import { Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "./ui/button"

import Logo from "@/assets/logo.svg"

export const Header = () => (
	<header className="bg-card border-border mx-auto my-4 w-7xl rounded-md border p-2">
		<nav className="flex items-center justify-between">
			<div className="h-8 w-8">
				<Link href="/" className="h-full w-full">
					<Image src={Logo} alt="Logo" className="h-full w-full rounded-md" />
				</Link>
			</div>

			<div className="flex items-center gap-2">
				<Button size={"icon"} variant={"secondary"} asChild>
					<Link href="https://github.com/drujbanjo" target="_blank">
						<Github />
					</Link>
				</Button>
			</div>
		</nav>
	</header>
)
