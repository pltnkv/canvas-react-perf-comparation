import React from 'react'

export function initDadReact(event:React.MouseEvent, onMoveCb: (deltaX:number, deltaY:number) => void, onEndCb: () => void) {

	let startX = event.clientX
	let startY = event.clientY

	const onMove = (e: MouseEvent) => {
		onMoveCb(e.clientX - startX, e.clientY - startY)
	}

	const onUp = (e: MouseEvent) => {
		document.removeEventListener('mousemove', onMove)
		document.removeEventListener('mouseup', onUp)
		onEndCb()
	}

	document.addEventListener('mousemove', onMove)
	document.addEventListener('mouseup', onUp)

	return () => {
		document.removeEventListener('mousemove', onMove)
		document.removeEventListener('mouseup', onUp)
	}
}

