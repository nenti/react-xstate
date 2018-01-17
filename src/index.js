import React, { Component } from 'react'
import { Machine } from 'xstate'

export const mountXstate = (stateMachine = {}, reducers = []) => (PassedComponent) => {
  const machine = Machine(stateMachine)
  const TRANSITION_QUEUE = []

  return class ReactXstate extends Component {
    constructor(props) {
      super(props)
      this.state = { value: machine.initialStateValue }
      this.transition = this.transition.bind(this)
    }
    transition(event) {
      TRANSITION_QUEUE.push(event)
      console.log(`TRANSITION_QUEUE ADD: ${JSON.stringify(TRANSITION_QUEUE)}`)
      if (TRANSITION_QUEUE.length === 1) {
        const execFunction = ((evt) => new Promise((() => {
          const { value: currentState } = this.state
          const nextState =
            machine.transition(currentState, evt.type)
          const { value, actions } = nextState
          console.log(`StateEvent: ${JSON.stringify(evt)}, nextState: ${JSON.stringify(nextState)}`)
          if (actions) {
            const actionState = actions
              .reduce((state, action) => ({
                ...this.command(action, evt),
                ...state,
              }), {})

            this.setState({
              value,
              ...actionState,
            }, () => {
              TRANSITION_QUEUE.shift()
              console.log(`TRANSITION_QUEUE FINISH: ${JSON.stringify(TRANSITION_QUEUE)}`)
              if (TRANSITION_QUEUE[0]) {
                execFunction(TRANSITION_QUEUE[0]).catch(err => {
                  console.error(err)
                })
              }
            })
          }
        }).bind(this)))
        execFunction(TRANSITION_QUEUE[0]).catch(err => {
          console.error(err)
        })
      }
    }
    command(action, event) {
      return reducers
        .reduce((state, reducer) => ({
          ...reducer(action, event, this),
          ...state,
        }), {})
    }
    render() {
      return (
        <PassedComponent
          {...this.props}
          xstate={this.state}
          transition={this.transition}
        />
      )
    }
  }
}
