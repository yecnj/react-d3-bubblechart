import React from 'react'
import * as d3 from 'd3'
import './App.css'
import Bubbles from './components/Bubbles'
import { createNodes } from './utils'

export default class App extends React.Component {
  state = {
    data: [],
    grouping: 'all',
  }

  componentDidMount() {
    d3.csv('data/subject.csv', (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      this.setState({
        data: createNodes(data),
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Bubbles width={960} height={640} data={this.state.data} forceStrength={0.03} center={{x: 480, y: 320}} />
      </div>
    )
  }

}
