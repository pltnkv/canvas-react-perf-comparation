export function getWidgetsNumber():number {
	const el = document.querySelector('#widgets-number') as HTMLInputElement
	return parseInt(el.value)
}

export function useCanvasFallback():boolean {
	const el = document.querySelector('#use-canvas') as HTMLInputElement
	return el.checked
}

export type Tool = 'move-container'|'move-each-widget'

export function subscribeTool(onToolChange:(tool:Tool) => void) {
	document.querySelectorAll('input[name="tool"]').forEach(el => {
		el.addEventListener('click', () => {
			onToolChange(getTool())
		})
	})
}

export function getTool():Tool {
	const el = document.querySelector('input[name="tool"]:checked') as HTMLInputElement
	return  el.value as any
}
