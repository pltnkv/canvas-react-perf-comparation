import {Container, Graphics, Stage} from '@inlet/react-pixi/legacy'
import React from 'react'
import ReactDOM from 'react-dom'
import * as PIXI from 'pixi.js-legacy'
import {getTool, getWidgetsNumber, subscribeTool, Tool, useCanvasFallback} from '../commons'
import {iniDad} from '../plain/dad'

type IWidget = {id: number, type: 'img' | 'shape', x: number, y: number, bgColor: number, rotation: number}

class Widget extends React.PureComponent<{w: IWidget}> {
	private draw = (g: PIXI.Graphics) => {
		g.beginFill(Math.random() * 0xFFFFFF)
		g.drawRect(0, 0, 10, 10)
	}

	render() {
		return (
			<Container x={this.props.w.x} y={this.props.w.y}>
				<Graphics draw={this.draw}/>
			</Container>
		)
	}
}

class WidgetsContainer extends React.PureComponent<{widgets: IWidget[]}> {

	componentDidMount(): void {

	}

	render() {
		//NOTE: render 50*50 widgets takes ~6ms
		return <Container>
			{this.props.widgets.map(w => <Widget key={w.id} w={w}/>)}
		</Container>
	}
}

class Root extends React.PureComponent<{x: number, y: number, widgets: IWidget[]}> {

	componentDidMount(): void {

	}

	render() {
		return <Container x={this.props.x} y={this.props.y}>
			<WidgetsContainer widgets={this.props.widgets}/>
		</Container>
	}
}

class App extends React.Component<{}, {canvasX: number, canvasY: number, widgets: IWidget[], tool: Tool}> {

	constructor(props: any) {
		super(props)
		this.state = {canvasX: 0, canvasY: 0, widgets: generateInitWidgets(), tool: getTool()}
	}

	private onMouseDown(e: React.MouseEvent) {

	}

	componentDidMount(): void {

		////////////////////////////////////////////////
		//drag-adn-drop
		////////////////////////////////////////////////
		let startX = 0
		let startY = 0
		let origWidgets: IWidget[] = []
		iniDad(() => {
			if (this.state.tool === 'move-container') {
				startX = this.state.canvasX
				startY = this.state.canvasY
			} else {
				origWidgets = [...this.state.widgets]
			}

		}, (deltaX, deltaY) => {
			if (this.state.tool === 'move-container') {
				this.setState({
					canvasX: startX + deltaX,
					canvasY: startY + deltaY,
				})
			} else {
				//NOTE: cloning 50*50 widgets takes ~1ms
				const newWidgets = this.state.widgets.map((w, i) => {
					return {
						...w,
						x: origWidgets[i].x + deltaX,
						y: origWidgets[i].y + deltaY,
					}
				})
				//NOTE: setState 50*50 widgets takes ~40ms
				this.setState({widgets: newWidgets})
			}

		}, () => {

		})

		////////////////////////////////////////////////
		//tool
		////////////////////////////////////////////////
		subscribeTool((tool) => {
			this.setState({tool})
		})
	}

	render() {
		return (
			<Stage onMouseDown={this.onMouseDown}
				   width={800}
				   height={800}
				   options={{autoDensity: true, backgroundColor: 0x51262a, forceCanvas: useCanvasFallback()}}>
				<Root x={this.state.canvasX} y={this.state.canvasY} widgets={this.state.widgets}/>
			</Stage>
		)
	}
}

export function initReactPixiClasses() {
	ReactDOM.render(<App/>, document.getElementById('root'))
}

function generateInitWidgets(): IWidget[] {
	const NUMBER = getWidgetsNumber()
	const widgets: IWidget[] = []
	for (let i = 0; i < NUMBER; i++) {
		for (let j = 0; j < NUMBER; j++) {
			widgets.push({
				id: genUniqId(),
				type: 'shape',
				x: i * 10,
				y: j * 10,
				bgColor: 0,
				rotation: 0,
			})
		}
	}
	return widgets
}

let id = 0

function genUniqId(): number {
	return ++id
}
