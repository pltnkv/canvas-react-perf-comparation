import {Container, Graphics, Stage, useTick} from '@inlet/react-pixi/legacy'
import React, {useEffect, useReducer, useState} from 'react'
import ReactDOM from 'react-dom'
import * as PIXI from 'pixi.js-legacy'
import {initDadReact} from './dad-react'
import {getTool, getWidgetsNumber, subscribeTool, Tool, useCanvasFallback} from './../commons'

type IWidget = {id: number, type: 'img' | 'shape', x: number, y: number, bgColor: number, rotation: number}
type IAppState = {
	widgets: IWidget[]
	stageX: number
	stageY: number
	rotateWidgets: boolean
	tool: Tool
}

enum Action {
	MoveStage = 'MoveStage',
	MoveEachWidget = 'MoveEachWidget',
	RotateWidgets = 'RotateWidgets',
	SetRotateWidgets = 'SetRotateWidgets',
	SetTool = 'SetTool',
}

type RootAction =
	| {type: Action.MoveStage, x: number, y: number}
	| {type: Action.MoveEachWidget, deltaX: number, deltaY: number, initWidgets: IWidget[]}
	| {type: Action.RotateWidgets, delta: number}
	| {type: Action.SetRotateWidgets, value: boolean}
	| {type: Action.SetTool, value: Tool}

export type ActionDispatcher = (action: RootAction) => void;

function stateReducer(state: IAppState, action: RootAction): IAppState {

	switch (action.type) {
		case Action.MoveStage: {
			return {...state, stageX: action.x, stageY: action.y}
		}

		case Action.SetRotateWidgets: {
			return {...state, rotateWidgets: action.value}
		}

		case Action.RotateWidgets: {
			return {
				...state,
				widgets: state.widgets.map(w => {
					return {
						...w,
						rotation: action.delta,
					}
				}),
			}
		}

		case Action.MoveEachWidget: {
			return {
				...state,
				widgets: state.widgets.map((w, i) => {
					return {
						...w,
						x: action.initWidgets[i].x + action.deltaX,
						y: action.initWidgets[i].y + action.deltaY,
					}
				}),
			}
		}

		case Action.SetTool: {
			return {...state, tool: action.value}
		}

		default:
			throw new Error('Unknown action')
	}

}

const Widget = React.memo((props: {w: IWidget}) => {
	// console.log('w')
	const draw = React.useCallback((g: PIXI.Graphics) => {
		g.beginFill(Math.random() * 0xFFFFFF)
		g.drawRect(0, 0, 10, 10)
	}, [])

	return (
		<Container x={props.w.x} y={props.w.y} rotation={props.w.rotation}>
			<Graphics draw={draw}/>
		</Container>
	)
})

const WidgetsContainer = React.memo((props: {widgets: IWidget[]}) => {
	return (<Container>
			{props.widgets.map(w => <Widget key={w.id} w={w}/>)}
		</Container>
	)
})

const Root = (props: {appState: IAppState, dispatch: ActionDispatcher}) => {
	useTick(delta => {
		if (delta) {
			initRotationDelta += 0.01 * delta
			props.dispatch({type: Action.RotateWidgets, delta: initRotationDelta})
		}
	}, props.appState.rotateWidgets)

	return (
		<Container x={props.appState.stageX} y={props.appState.stageY}>
			<WidgetsContainer widgets={props.appState.widgets}/>
		</Container>
	)
}

let initRotationDelta = 0

export function initReactPixiHooks() {

	const App = () => {
		const [mouseDownEvent, setMouseDownEvent] = useState<React.MouseEvent | undefined>(undefined)

		const [appState, dispatch] = useReducer(stateReducer, {
			widgets: generateInitWidgets(),
			stageX: 0,
			stageY: 0,
			rotateWidgets: false,
			tool: getTool(),
		})

		useEffect(() => {
			////////////////////////////////////////////////
			// listen ui events
			document.querySelector('#start-rotation-btn')!.addEventListener('click', () => {
				dispatch({type: Action.SetRotateWidgets, value: true})
			})

			document.querySelector('#stop-rotation-btn')!.addEventListener('click', () => {
				dispatch({type: Action.SetRotateWidgets, value: false})
			})

			////////////////////////////////////////////////
			//tool
			subscribeTool((tool) => {
				dispatch({type: Action.SetTool, value: tool})
			})
		}, [])

		useEffect(() => {
			if (mouseDownEvent) {
				let startX = appState.stageX
				let startY = appState.stageY
				let initWidgets: IWidget[]
				if (appState.tool === 'move-each-widget') {
					initWidgets = [...appState.widgets]
				}

				return initDadReact(mouseDownEvent,
					(deltaX, deltaY) => {
						if (appState.tool === 'move-each-widget') {
							dispatch({type: Action.MoveEachWidget, deltaX, deltaY, initWidgets})
						} else {
							dispatch({type: Action.MoveStage, x: startX + deltaX, y: startY + deltaY})
						}
					}, () => {
						setMouseDownEvent(undefined)
					})
			}
		}, [mouseDownEvent])

		function onMouseDown(e: React.MouseEvent) {
			setMouseDownEvent(e)
		}

		return <Stage
			//raf={false}
			//renderOnComponentChange={true}
			onMouseDown={onMouseDown} width={800} height={800} options={{autoDensity: true, backgroundColor: 0x01262a, forceCanvas: useCanvasFallback()}}>
			<Root appState={appState} dispatch={dispatch}/>
		</Stage>
	}

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
