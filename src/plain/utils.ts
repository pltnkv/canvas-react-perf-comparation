import * as PIXI from 'pixi.js-legacy'
import {useCanvasFallback} from './../commons'

export function getPixiApp() {
	return new PIXI.Application({
		forceCanvas: useCanvasFallback(),
		width: 800,
		height: 800,
		autoDensity: true,
		backgroundColor: 0x10bb99,
	})
}

