import * as PIXI from 'pixi.js-legacy'
import {getPixiApp} from './utils'
import {iniDad} from './dad'
import {getTool, getWidgetsNumber, subscribeTool} from '../commons'

export function initPlainPixi() {
	const app = getPixiApp()
	console.log(app.renderer.type)
	document.getElementById('root')!.appendChild(app.view)

	app.loader
		.add('desyrel', 'https://pixijs.io/examples/examples/assets/bitmap-font/desyrel.xml')
		.load(() => {
			init0(app)
		})

}

function init0(app: PIXI.Application) {
	const container = new PIXI.Container()
	app.stage.addChild(container)

	const ctrl = new Controller(container)

	const NUMBER = getWidgetsNumber()

	for (let i = 0; i < NUMBER; i++) {
		for (let j = 0; j < NUMBER; j++) {
			ctrl.addWidget(i * 10, j * 10)
		}
	}

	// Move container to the center
	let rotateWidgets = false
	let containerX = app.screen.width / 2
	let containerY = app.screen.height / 2

	// Listen for animate update
	app.ticker.add((delta: number) => {
		// rotate the container!
		// use delta to create frame-independent transform
		// container.rotation -= 0.01 * delta
		// console.log(delta)
		container.x = containerX
		container.y = containerY

		if (rotateWidgets) {
			ctrl.widgets.forEach((w) => {
				w.visual.rotation += 0.01 * delta
			})
		}
	})

	let tool = getTool()

	/////////////////////////////////////////////
	// Drag-and-drop
	/////////////////////////////////////////////
	let startX = 0
	let startY = 0
	let origWidgets: {x: number; y: number}[] = []
	iniDad(() => {
		if (tool === 'move-container') {
			startX = containerX
			startY = containerY
		} else {
			origWidgets = ctrl.widgets.map(w => ({x: w.visual.x, y: w.visual.y}))
		}
	}, (deltaX, deltaY) => {
		if (tool === 'move-container') {
			containerX = startX + deltaX
			containerY = startY + deltaY
		} else {
			ctrl.widgets.forEach((w, i) => {
				w.visual.x = origWidgets[i].x + deltaX
				w.visual.y = origWidgets[i].y + deltaY
			})
		}
	}, () => {
	})

	/////////////////////////////////////////////
	// listen ui events
	/////////////////////////////////////////////

	document.querySelector('#start-rotation-btn')!.addEventListener('click', () => {
		rotateWidgets = true
	})

	document.querySelector('#stop-rotation-btn')!.addEventListener('click', () => {
		rotateWidgets = false
	})

	subscribeTool((newTool) => {
		tool = newTool
	})
}

class Controller {

	widgets: Widget[] = []

	constructor(public container: PIXI.Container) {

	}

	addWidget(x: number, y: number) {
		const w = new Widget(x, y)
		this.widgets.push(w)
		this.container.addChild(w.visual)
	}
}

class Widget {

	visual: PIXI.DisplayObject

	constructor(x: number, y: number) {
		this.visual = this.drawImage1(x, y)
		// this.visual = this.drawRect(x, y)
		// this.visual = this.drawText(x, y)
		// this.visual = this.drawBitmapText(x, y)
	}

	//work fast
	private onClick() {
		this.visual.scale.x *= 1.25
		this.visual.scale.y *= 1.25
	}

	private drawImage1(x: number, y: number) {
		const s = new PIXI.Container()
		const texture = PIXI.Texture.from('https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png')
		const bunny = new PIXI.Sprite(texture)
		bunny.anchor.set(0.5)
		s.addChild(bunny)
		s.scale = new PIXI.ObservablePoint(() => {}, null, 2, 2)
		// s.interactive = true
		// s.buttonMode = true
		// s.on('pointerdown', this.onClick, this)
		s.x = x
		s.y = y
		return s
	}

	//more performant
	private drawImage0(x: number, y: number) {
		const texture = PIXI.Texture.from('https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png')
		const bunny = new PIXI.Sprite(texture)
		bunny.anchor.set(0.5)
		bunny.x = x
		bunny.y = y
		return bunny
	}

	//performance depends on different TextStyle options. At least fontSize and wordWrapWidth
	private drawText(x: number, y: number) {
		const style = new PIXI.TextStyle({
			fontFamily: 'Snippet',//Arial | Snippet
			fontSize: 38,
			// fontStyle: 'italic',
			// fontWeight: 'bold',
			fill: ['#ffffff', '#00ff99'], // gradient
			stroke: '#4a1850',
			strokeThickness: 5,
			// dropShadow: true,
			// dropShadowColor: '#000000',
			// dropShadowBlur: 4,
			// dropShadowAngle: Math.PI / 6,
			// dropShadowDistance: 6,
			wordWrap: true,
			wordWrapWidth: 400,
			// lineJoin: 'round',
		})

		const richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', style)

		const s = new PIXI.Container()
		s.addChild(richText)
		// s.scale = new PIXI.ObservablePoint(() => {}, null, 4, 4)
		s.scale = new PIXI.ObservablePoint(() => {}, null, 1, 1)
		s.x = x
		s.y = y
		return s
	}

	//very performant
	private drawBitmapText(x: number, y: number) {
		const bitmapFontText = new PIXI.BitmapText('bitmap fonts are supported!\nWoo yay!', {fontName: 'Desyrel', fontSize: 55, align: 'left', maxWidth: 200})

		bitmapFontText.x = x
		bitmapFontText.y = y

		return bitmapFontText
	}

	private drawRect(x: number, y: number) {
		const s = new PIXI.Container()
		const rect = new PIXI.Graphics()
		rect.beginFill(Math.random() * 0xFFFFFF)
		rect.drawRect(0, 0, 10, 10)
		s.addChild(rect)
		s.x = x
		s.y = y
		return s
	}
}
