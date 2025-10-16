"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import "./TreeVisualization.css"

function TreeVisualization({ treeData, selectedPath }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create a tree layout
    const treeLayout = d3.tree().size([innerWidth, innerHeight])

    // Convert the data to a d3 hierarchy
    const root = d3.hierarchy(treeData)

    // Compute the tree layout
    const treeData2 = treeLayout(root)

    // Add links between nodes
    svg
      .selectAll(".link")
      .data(treeData2.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y),
      )
      .classed(
        "selected-link",
        (d) => selectedPath.includes(d.source.data.id) && selectedPath.includes(d.target.data.id),
      )

    // Add nodes
    const nodes = svg
      .selectAll(".node")
      .data(treeData2.descendants())
      .enter()
      .append("g")
      .attr("class", (d) => {
        let classes = "node"
        if (selectedPath.includes(d.data.id)) classes += " selected-node"
        if (d.data.isChest) classes += " chest-node"
        return classes
      })
      .attr("transform", (d) => `translate(${d.x},${d.y})`)

    // Add circles for nodes
    nodes
      .filter((d) => !d.data.isChest)
      .append("circle")
      .attr("r", (d) => (selectedPath.includes(d.data.id) ? 12 : 8))

    // Add chest icons for final nodes
    nodes
      .filter((d) => d.data.isChest)
      .append("text")
      .attr("class", "chest-icon")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .text((d) => (d.data.isFull ? "💰" : "📦"))
      .attr("font-size", "24px")

    // Add labels for nodes
    nodes
      .append("text")
      .attr("dy", (d) => (d.data.isChest ? "30px" : "25px"))
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .text((d) => d.data.name)
      .attr("class", (d) => {
        let classes = "node-label"
        if (selectedPath.includes(d.data.id)) classes += " selected-label"
        return classes
      })
  }, [treeData, selectedPath])

  return (
    <div className="tree-visualization">
      <h2 className="tree-title">Adventure Map</h2>
      <p className="tree-description">Follow your path to the treasure!</p>
      <div className="tree-svg-container">
        <svg ref={svgRef} className="tree-svg"></svg>
      </div>
    </div>
  )
}

export default TreeVisualization

