import React from 'react'
import * as d3 from 'd3'
import { fillColor } from '../utils'
import tooltip from './Tooltip'

export default class Bubbles extends React.Component {
  constructor(props) {
    super(props)
    const { forceStrength, center } = props
    this.simulation = d3.forceSimulation()
      .velocityDecay(0.2)
      .force('x', d3.forceX().strength(forceStrength).x(center.x))
      .force('y', d3.forceY().strength(forceStrength).y(center.y))
      .force('charge', d3.forceManyBody().strength(this.charge.bind(this)))
      .on('tick', this.ticked.bind(this))
      .stop()
  }

  state = {
    g: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.renderBubbles(nextProps.data)
    }
  }

  shouldComponentUpdate() {
    // we will handle moving the nodes on our own with d3.js
    // make React ignore this component
    return false
  }

  onRef = (ref) => {
    this.setState({ g: d3.select(ref) }, () => this.renderBubbles(this.props.data))
  }

  ticked() {
    this.state.g.selectAll('.bubble')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  }

  charge(d) {
    return -this.props.forceStrength * (d.radius ** 2.0)
  }

  renderBubbles(data) {
    const bubbles = this.state.g.selectAll('.bubble').data(data, d => d.id)

    // Exit
    bubbles.exit().remove()

    // Enter
    const bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', d => {
        d.color = fillColor()
        return d.color
      })
      .attr('stroke', d => d3.rgb(d.color).darker())
      .attr('stroke-width', 2)
      .on('mouseover', showDetail)  // eslint-disable-line
      .on('mouseout', hideDetail) // eslint-disable-line

    bubblesE.transition().duration(2000).attr('r', d => d.radius).on('end', () => {
      this.simulation.nodes(data)
      .alpha(1)
      .restart()
    })
  }

  render() {
    const { width, height } = this.props
    return (
      <svg className="bubbleChart" width={width} height={height}>
        <g ref={this.onRef} className="bubbles" />
      </svg>
    )
  }
}

export function showDetail(d) {
  d3.select(this).attr('stroke', 'black')

  const content = `<span class="name">Title: </span><span class="value">${
                  d.name
                  }</span><br/>` +
                  `<span class="name">Amount: </span><span class="value">${
                  d.value
                  }</span>`

  tooltip.showTooltip(content, d3.event)
}

export function hideDetail(d) {
  d3.select(this)
      .attr('stroke', d3.rgb(d.color).darker())
  tooltip.hideTooltip()
}
