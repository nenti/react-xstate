# react-xstate
Connecting react components with [xstate](https://github.com/davidkpiano/xstate) state machine library.

# Why?
`react-xstate` gives you easy access to [xstate](https://github.com/davidkpiano/xstate) in the react world! ;)

Xstate allows you to improve state handling of your components by applying formal definition of a state machine including states and transitions. This allows you to better separate business logic from state handling and separate them into different files. You can use `react-xstate` to transition your UI-programming to model-driven-development which besides better code structure removes major error source and enables visual documentation.

##### The xstate library
This library bases on the [xstate](https://github.com/davidkpiano/xstate) by David Khourshid
- Read [📽 the slides](http://slides.com/davidkhourshid/finite-state-machines) ([🎥 video](https://www.youtube.com/watch?v=VU1NKX6Qkxc))
- [Statecharts - A Visual Formalism for Complex Systems](http://www.inf.ed.ac.uk/teaching/courses/seoc/2005_2006/resources/statecharts.pdf) by David Harel
- Checkout [xstate visualizer](https://codepen.io/davidkpiano/details/ayWKJO) for graph generation by David Khourshid

##### Deep dive
The `xstate` library implements the formal processing of state machines and leaves handling transitions, updating state and reducing actions to the user. This is where `react-xstate` comes into play and integrates state and transition handling directly into your react components, only by applying a `state machine` and `action reducers` and returning a `xstate` prop and a transition function.


# Installation
1. ``npm install react-xstate --save``
2. ``import { mountXstate } from 'react-xstate'``

# Usage
Mount the xstate machine to your component by applying a `machine` definition and at least one `actionReducer` to your component.

```js
mountXstate(appMachine, [appReducer])(App)
```

## Example
This simple state machine implements an easy to use statechart that transitions between ping and pong and when you click in state ping you will trigger the `consoleLog` action.

![State Machine](ppmachine.png "Ping Pong State Machine")

#### State Machine
````js
const appMachine = {
  initial: 'pending',
  states: {
    ping: {
      on: {
        CLICK: {
          pong: { actions: ['consoleLog'] }
        }
      }
    },
    pong: {
      on: {
        CLICK: 'ping',
      }
    },
  }
}
````

#### Action Reducer
````js
const appReducer = (action, event, xstate) => {
  if(action === 'consoleLog') {
    console.log('Fired action: consoleLog')
  }
}
````

#### Stateful Component

````js
class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    const { transition } = this.props
    transition({ type: 'CLICK' })
  }
  render() {
    const { xstate: { value: state } } = this.props
    console.log(`State: ${JSON.stringify(state)}`)
    return (
      <button onClick={this.handleSubmit}>Click</button>
    );
  }
}

export default mountXstate(appMachine, [appReducer])(App)
````

# Prop definition
The higher order component mountXstate will exposes two new props to your component:

1. **xstate** prop which exposes the [state](http://davidkpiano.github.io/xstate/docs/#/api/state) of the state machine to enable the user to build statefull component logic
2. **transition** prop which exposes the transition function to fire events towards your state machine.

