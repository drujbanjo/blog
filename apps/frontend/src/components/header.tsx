import { Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Container } from "./container"
import { ThemeToggle } from "./themeToggle"
import { Button } from "./ui/button"

import Logo from "@/assets/logo.svg"

export const Header = () => (
	<header className="my-4">
		<Container>
			<nav className="bg-card border-border flex items-center justify-between rounded-md border p-2">
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
					<ThemeToggle />
				</div>
			</nav>
		</Container>
	</header>
)
