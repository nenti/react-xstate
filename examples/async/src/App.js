import React, { Component } from 'react';
import { mapState } from 'xstate';
import { mountXstate } from 'react-xstate'
import logo from './logo.svg';

const machine = {
  id: 'async',
  initial: 'pending',
  states: {
    pending: {
      on: {
        CLICK: {
          loading: { actions: ['loadData'] }
        }
      }
    },
    loading: {
      initial: 'one',
      states: {
        one: {
          on: { MORE: 'two' }
        },
        two: {
          on: { MORE: 'three' }
        },
        three: {}
      },
      on: {
        LOADED: 'success',
        ERROR: 'error'
      }
    },
    success: {
      on: {
        CLICK: {
          loading: { actions: ['loadData'] }
        }
      }
    },
    error: {
      on: {
        CLICK: {
          loading: { actions: ['loadData'] }
        }
      }
    }
  }
}

const labelMap = {
  pending: 'Load data',
  success: 'Yay! Load data again?',
  loading: 'Loading...',
  error: 'Uh oh, try again'
};

const disabledMap = {
  pending: false,
  loading: true,
  success: false,
  error: false
};

const textMap = {
  'loading.one': 'uno!',
  'loading.two': 'dos!',
  'loading.three': 'tres! almost there!'
};

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
      <div className="App">
        <header className="App-header">
          <img width={100} src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">react-xstate async example</h1>
        </header>
        <button
          onClick={this.handleSubmit}
          disabled={mapState(disabledMap, state)}
        >
          {mapState(labelMap, state)}
        </button>
        <div>{mapState(textMap, state) || 'waiting...'}</div>
      </div>
    );
  }
}

const reducer = (action, event, xstate) => {
  const { transition } = xstate
  if(action === 'loadData') {
    setTimeout(() => transition({ type: 'MORE' }), 1000);
    setTimeout(() => transition({ type: 'MORE' }), 2000);
    setTimeout(() => {
      Math.random() < 0.5 ? transition({ type: 'LOADED' }) : transition({ type: 'ERROR' })
    }, 3000);
  }
}

export default mountXstate(machine, [reducer])(App);
