import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

function Assignment3() {

    const [data, setData] = useState([]);
    const [responses, setResponses] = useState([]);
    const [participantResponse, setParticipantResponse] = useState('');

    const handleResponseSubmit = () => {
        const reportedValue = parseFloat(participantResponse); // Convert input to a number
        const trueValue = data.find(d => d.mark).value; // Assuming 'mark' indicates the target bar
        const totalValue = data.reduce((acc, item) => acc + item.value, 0); // Sum of all values
    
        const error = calculateError(reportedValue, totalValue, trueValue); // Calculate the error
    
        // Store the new response with its error
        setResponses([...responses, { reportedValue, truePercent: (trueValue / totalValue) * 100, error }]);
        setParticipantResponse(''); // Reset input field
    };
    

    
    const calculateError = (reportedValue, totalValue, trueValue) => {
        // Calculate the true percentage (part compared to the whole)
        const truePercent = (trueValue / totalValue) * 100;
    
        // Calculate the reported percentage (what the participant reported as a percentage)
        const reportedPercent = (reportedValue / totalValue) * 100;
    
        // Calculate the absolute difference and apply the logarithmic scale with the offset of 1/8
        const difference = Math.abs(reportedPercent - truePercent);
        const error = Math.log2(difference + 1/8);
    
        return error;
    };




    const [visualizationType, setVisualizationType] = useState('bar'); // 'bar', 'pie', 'stacked-bar'

    // Function to generate random data
    const generateData = () => {
        const newData = Array.from({ length: Math.floor(Math.random() * 6) + 5 }, () => ({
            value: Math.floor(Math.random() * 101),
            mark: false
        }));
        // Randomly mark two data points
        newData[Math.floor(Math.random() * newData.length)].mark = true;
        newData[Math.floor(Math.random() * newData.length)].mark = true;
        return newData;
    };

    // Handle visualization change
    const handleVisualizationChange = (type) => {
        setVisualizationType(type);
        setData(generateData());
    };

    useEffect(() => {
        const svg = d3.select('svg');
        svg.selectAll('*').remove(); // Clear previous visualization
    
        // Set dimensions and margins
        const width = 800, height = 500, margin = 40;
        const radius = Math.min(width, height) / 2 - margin;
    
        if (visualizationType === 'bar') {
            const x = d3.scaleBand()
                        .range([0, width])
                        .domain(data.map((_, i) => i))
                        .padding(0.1);
        
            const y = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.value)])
                        .range([height, 0]);
        
            const g = svg.append('g')
                         .attr('transform', `translate(${margin.left},${margin.top})`);
        
            g.append('g')
             .attr('transform', `translate(0,${height})`)
             .call(d3.axisBottom(x));
        
            g.append('g')
             .call(d3.axisLeft(y));
        
            g.selectAll('.bar')
             .data(data)
             .enter().append('rect')
             .attr('class', 'bar')
             .attr('x', (d, i) => x(i))
             .attr('y', d => y(d.value))
             .attr('width', x.bandwidth())
             .attr('height', d => height - y(d.value))
             .attr('fill', 'white')
             .attr('stroke', 'black');
        
            // Adjusting dots to ensure they are always inside the bars
            g.selectAll('.dot')
             .data(data.filter(d => d.mark))
             .enter().append('circle')
             .attr('class', 'dot')
             .attr('cx', (d, i) => x(i) + x.bandwidth() / 2)
             .attr('cy', d => {
                 // Position the dot within the bar, avoiding the very top or bottom
                 const barHeight = height - y(d.value);
                 return y(d.value) + barHeight * 0.1; // Position the dot 10% down from the top of the bar
             })
             .attr('r', 5)
             .attr('fill', 'black');
             
        } else if (visualizationType === 'pie') {
            // Create a pie chart with black outlines
            const pie = d3.pie().value(d => d.value);
            const data_ready = pie(data);
    
            const arc = d3.arc()
                          .innerRadius(0)
                          .outerRadius(radius);
    
            svg.append("g")
               .attr("transform", `translate(${width / 2}, ${height / 2})`)
               .selectAll('path')
               .data(data_ready)
               .enter()
               .append('path')
               .attr('d', arc)
               .attr('fill', 'white')
               .attr("stroke", "black")
               .style("stroke-width", "2px");
    
            // Adding dots to mark data points
            svg.append("g")
               .attr("transform", `translate(${width / 2}, ${height / 2})`)
               .selectAll('circle')
               .data(data_ready.filter(d => d.data.mark))
               .enter()
               .append('circle')
               .attr("transform", d => `translate(${arc.centroid(d)})`)
               .attr('r', 5)
               .attr('fill', 'black');
    
        } else if (visualizationType === 'stacked-bar') {
            // Assuming data is structured for individual segments
            const keys = data.map((_, i) => `value${i}`);
            const stackGenerator = d3.stack()
                .keys(keys)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);
    
            // Prepare a single data item for stacking
            const modifiedData = [{
                ...data.reduce((acc, d, i) => ({ ...acc, [`value${i}`]: d.value }), {})
            }];
    
            const layers = stackGenerator(modifiedData);
    
            const yScale = d3.scaleLinear()
                .domain([0, d3.sum(data, d => d.value)]) // Scale to sum of values
                .range([height, 0]);
    
            const xScale = d3.scaleBand()
                .domain([0]) // Single bar
                .range([0, width])
                .padding(0.1);
    
            // Draw the stacked bar
            svg.append("g")
                .selectAll("g")
                .data(layers)
                .enter().append("g")
                .attr("fill", 'white')
                .attr("stroke", "black")
                .attr("stroke-width", "2")
                .selectAll("rect")
                .data(d => d)
                .enter().append("rect")
                .attr("x", width / 4) // Center the bar
                .attr("y", d => yScale(d[1]))
                .attr("height", d => yScale(d[0]) - yScale(d[1]))
                .attr("width", width / 2);
    
            // Adding dots for marked data points
            data.forEach((d, i) => {
                if (d.mark) {
                    let segmentTop = yScale(layers[i][0][1]);
                    let segmentBottom = yScale(layers[i][0][0]);
                    let middleY = (segmentTop + segmentBottom) / 2; // Calculate the middle of the segment
    
                    svg.append("circle")
                        .attr("cx", width / 2) // Center horizontally in the bar
                        .attr("cy", middleY)
                        .attr("r", 5)
                        .attr("fill", "black");
                }
            });
        }
    }, [data, visualizationType]);
    


    return (
        <div>
            <h2>Assignment 3: Cleveland and McGill Experiments</h2>
            <div>
                <button onClick={() => handleVisualizationChange('bar')}>Bar Chart</button>
                <button onClick={() => handleVisualizationChange('pie')}>Pie Chart</button>
                <button onClick={() => handleVisualizationChange('stacked-bar')}>Stacked Bar Chart</button>
            </div>
            <svg width="800" height="500"></svg>
            <input 
                type="number" 
                value={participantResponse} 
                onChange={e => setParticipantResponse(e.target.value)} 
                placeholder="Enter your response..."
            />
            <button onClick={handleResponseSubmit}>Submit Response</button>
            <svg width="800" height="600"></svg>
            <textarea 
    value={`Reported Percent, True Percent, Error\n${responses.map(r => 
        `${r.reportedValue.toFixed(2)}%, ${r.truePercent.toFixed(2)}%, ${r.error.toFixed(2)}`
    ).join('\n')}`} 
    readOnly
    style={{ width: '100%', height: '100px' }}
/>
        </div>
    );
}

export default Assignment3;



