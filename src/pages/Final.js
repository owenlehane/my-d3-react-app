import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Final.css'; // Assuming you have some basic styles defined

function Final() {
    const svgRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        const data = [
            { id: 1, time: "09:30", answers: { "Q1": "Yes", "Q2": "No", "Q3": "Maybe", "Q4": "Yes", "Q5": "No", "Q6": "Maybe", "Q7": "Yes", "Q8": "No" } },
            { id: 2, time: "09:45", answers: { "Q1": "No", "Q2": "Yes", "Q3": "Yes", "Q4": "No", "Q5": "Maybe", "Q6": "Yes", "Q7": "No", "Q8": "Maybe" } },
            // More data points
        ];

        const parseTime = d3.timeParse("%H:%M");
        const transformedData = data.map(d => ({
            ...d,
            time: parseTime(d.time)
        }));

        const margin = { top: 20, right: 30, bottom: 30, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(transformedData, d => d.time))
            .range([0, width]);

        const tooltip = d3.select(tooltipRef.current);

        svg.selectAll(".node")
            .data(transformedData)
            .enter().append("circle")
            .attr("class", "node")
            .attr("cx", d => x(d.time))
            .attr("cy", height / 2)
            .attr("r", 5)
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible")
                       .html(`ID: ${d.id}<br/>` +
                             Object.entries(d.answers)
                                   .map(([key, value]) => `<div>${key}: ${value}</div>`)
                                   .join(""))
                       .style("left", `${event.pageX + 10}px`)
                       .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", () => tooltip.style("visibility", "hidden"));

        svg.append("g")
            .attr("transform", `translate(0,${height / 2})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

    }, []);

    return (
        <div>
            <h1>Timeline of Answers</h1>
            <svg ref={svgRef}></svg>
            <div ref={tooltipRef} className="tooltip"></div>
        </div>
    );
}

export default Final;
