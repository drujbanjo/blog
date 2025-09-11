import { Node } from "unist"
import { visit } from "unist-util-visit"

export default function remarkBlockquote() {
	return (tree: Node) => {
		visit(tree, "blockquote", (node: any) => {
			const firstChild = node.children[0]
			if (firstChild.type === "paragraph" && typeof firstChild.children[0].value === "string") {
				const match = firstChild.children[0].value.match(/^\[(warn|info|important)\]\s*(.*)/)
				if (match) {
					node.data = {
						hName: "Blockquote",
						hProperties: { type: match[1] }
					}
					firstChild.children[0].value = match[2] // убираем префикс из текста
				}
			}
		})
	}
}
