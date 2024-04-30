import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Final.css'; 


import responseData from '/Users/owenlehane/my-d3-react-app/src/Goatconnect User Study Survey.json';

function Final() {
    const svgRef = useRef();
    const tooltipRef = useRef();
    const zoomRef = useRef(); 

    useEffect(() => {
        const parseTime = d3.timeParse("%H:%M:%S");
        const transformedData = responseData.map(d => ({
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

        const xAxis = d3.axisBottom(x).tickSizeOuter(0);

        const zoom = d3.zoom()
            .scaleExtent([0.5, 20])  // Limit zoom scale for better control
            .translateExtent([[0, 0], [width, height]])
            .on('zoom', (event) => {
                const transform = event.transform;
                svg.selectAll(".node")
                    .attr('cx', d => transform.applyX(x(d.time)));
                svg.select(".x-axis").call(xAxis.scale(transform.rescaleX(x)));
            });

        zoomRef.current = zoom; // Store the zoom behavior in ref gonna manip later

        svg.append('g')
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height / 2})`)
            .call(xAxis);

        svg.selectAll(".node")
            .data(transformedData)
            .enter().append("circle")
            .attr("class", "node")
            .attr("cx", d => x(d.time))
            .attr("cy", height / 2)
            .attr("r", 5)
            .on("mouseover", (event, d) => {
                d3.select(tooltipRef.current).style("visibility", "visible")
                    .html(`ID: ${d.id}<br/>` +
                          Object.entries(d.answers)
                                .map(([key, value]) => `<div>${key}: ${value}</div>`)
                                .join(""))
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", () => {
                d3.select(tooltipRef.current).style("visibility", "hidden");
            });

        svg.call(zoom); // Zoom to the SVG 

    }, []);

    const zoomIn = () => {
        d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.5);
    };

    const zoomOut = () => {
        d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.67);
    };

    const panLeft = () => {
        d3.select(svgRef.current).transition().call(zoomRef.current.translateBy, 50, 0);
    };

    const panRight = () => {
        d3.select(svgRef.current).transition().call(zoomRef.current.translateBy, -50, 0);
    };

    return (
        <div>
            <h1>GoatConnect User Study Results</h1>
            <svg ref={svgRef}></svg>
            <div ref={tooltipRef} className="tooltip"></div>
            <div className="button-container">
                <button className="zoom-button" onClick={zoomIn}>Zoom In</button>
                <button className="zoom-button" onClick={zoomOut}>Zoom Out</button>
                <button className="pan-button" onClick={panLeft}>Pan Left</button>
                <button className="pan-button" onClick={panRight}>Pan Right</button>
            </div>
            <footer className="footer">
            <p> To view my MQP, please click on this link: <a href="https://goatconnect.wpi.edu/faq" target="_blank">
                    https://goatconnect.wpi.edu/faq
                </a> 
                </p>
        </footer>
        </div>
        
    );
}

export default Final;

