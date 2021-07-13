export function iniDad(onStartCb: () => void, onMoveCb: (deltaX:number, deltaY:number) => void, onEndCb: () => void) {
	const root = document.querySelector('#root') as HTMLElement

	let startX = 0
	let startY = 0

	const onDown = (e: MouseEvent) => {
		startX = e.clientX
		startY = e.clientY
		document.addEventListener('mousemove', onMove)
		document.addEventListener('mouseup', onUp)
		onStartCb()
	}

	const onMove = (e: MouseEvent) => {
		onMoveCb(e.clientX - startX, e.clientY - startY)
	}

	const onUp = (e: MouseEvent) => {
		document.removeEventListener('mousemove', onMove)
		document.removeEventListener('mouseup', onUp)
		onEndCb()
	}
	root.addEventListener('mousedown', onDown)

	return () => {
		root.addEventListener('mousedown', onDown)
		document.removeEventListener('mousemove', onMove)
		document.removeEventListener('mouseup', onUp)
	}
}

