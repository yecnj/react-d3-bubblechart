import * as d3 from 'd3'

export function createNodes(rawData) {
  const maxAmount = d3.max(rawData, d => +d.total_amount)

  const radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 85])
      .domain([0, maxAmount])

  const myNodes = rawData.map(d => ({
    id: d.id,
    radius: radiusScale(+d.total_amount),
    value: +d.total_amount,
    name: d.grant_title,
    org: d.organization,
    group: d.group,
    year: d.start_year,
    x: Math.random() * 900,
    y: Math.random() * 800,
  }))

  myNodes.sort((a, b) => b.value - a.value)

  return myNodes
}

export const fillColor = d3.scaleOrdinal().domain(['low', 'medium', 'high']).range(['#d84b2a', '#beccae', '#7aa25c'])
