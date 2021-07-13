import {initReactPixiHooks} from './react-hooks/react-pixi-hooks'
import {initPlainPixi} from './plain/plain-pixi'
import {initReactPixiClasses} from './react-classes/react-pixi-classes'

document.querySelector('#plain-pixi-btn')!.addEventListener('click', () => {
	initPlainPixi()
	hideUIStartBox()
	showUIBox()
})

document.querySelector('#react-hooks-btn')!.addEventListener('click', () => {
	initReactPixiHooks()
	hideUIStartBox()
	showUIBox()
})


document.querySelector('#react-classes-btn')!.addEventListener('click', () => {
	initReactPixiClasses()
	hideUIStartBox()
	showUIBox()
})


function showUIBox() {
	const box = document.querySelector('#ui') as HTMLElement
	box.style.display = 'block'
}

function hideUIStartBox() {
	const box = document.querySelector('#ui-start') as HTMLElement
	box.style.display = 'none'
}
