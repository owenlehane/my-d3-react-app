import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Assignment1() {
    const ref = useRef();

    useEffect(() => {
        
        const svg = d3.select(ref.current)
                      .attr('width', 800)
                      .attr('height', 600);

        // Circle
        svg.append('circle')
           .attr('cx', 150)
           .attr('cy', 150)
           .attr('r', 50)
           .style('fill', 'red');

        // Rectangle
        svg.append('rect')
           .attr('x', 300)
           .attr('y', 100)
           .attr('width', 200)
           .attr('height', 100)
           .style('fill', 'blue');

        // Line
        svg.append('line')
           .attr('x1', 100)
           .attr('y1', 300)
           .attr('x2', 300)
           .attr('y2', 300)
           .style('stroke', 'green')
           .style('stroke-width', 5);

        // Triangle
        svg.append('polygon')
           .attr('points', '400,400 500,300 600,400')
           .style('fill', 'purple');

    }, []);

    return (
        <div>
            <h2>Assignment 1: Hello World: GitHub and d3</h2>
            <svg ref={ref}></svg>
        </div>
    );
}

export default Assignment1;
