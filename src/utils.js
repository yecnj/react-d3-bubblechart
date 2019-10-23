import * as d3 from 'd3'

export function createNodes(rawData) {
  const maxAmount = d3.max(rawData, d => +d["2019"])

  const radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 85])
      .domain([0, maxAmount])

  const myNodes = rawData.map((d, index) => ({
    id: d.index,
    radius: radiusScale(+d["2019"]),
    value: +d["2019"],
    name: d.key,
    x: Math.random() * 900,
    y: Math.random() * 800,
  }))

  myNodes.sort((a, b) => b.value - a.value)

  return myNodes
}

export const fillColor = () => ("#"+((1<<24)*Math.random()|0).toString(16))
