import React from 'react';
import { curveCardinal, area, scalePoint, scaleBand, scaleLinear, select, max,  axisLeft, axisBottom} from 'd3';

interface DataSet {
  name: string;
  count: number;
}
const AreaChart:React.FC = () => {
    const data = [
        {name:'Phase 0', count: 0},
        {name:'Phase 1', count: 100},
        {name:'Phase 2', count: 200},
        {name:'Phase 3', count: 300},
        {name:'Phase 4', count: 220}
        
    ];

const dimensions = {
      width: 300,
      height:300,
      charWidth: 250,
      charHeight: 200,
      marginLeft: 50,
      marginBottom: 50,
}
  
const svgRef = React.useRef();

const maxValue = max(data, data => data.count); 
const y = scaleLinear()
  .domain([0, maxValue])
  .range([dimensions.charHeight, 0]);

const x = scalePoint()
  .domain(data.map(d => d.name))
  .range([0, dimensions.charWidth])
  
  
  

  // will be called initially and on every data change
  React.useEffect(() => {
    const svg = select(svgRef.current);
    const yAxis = axisLeft(y);
    const xAxis = axisBottom(x);

        const xAxisGroup = svg
                                .append('g')
                                .attr('transform', `translate(${dimensions.marginLeft}, ${dimensions.charHeight})`)
                                .call(xAxis);
        const yAxisGroup = svg
                                .append('g')
                                .attr('transform', `translate(${dimensions.marginLeft}, ${0})`)
                                .call(yAxis);
    const myArea = area<DataSet>()
      .x(d => x(d.name))
      .y0(y(0))
      .y1(d => y(d.count))
      .curve(curveCardinal);
    // svg
    //   .selectAll("circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("r", value => value)
    //   .attr("cx", value => value * 2)
    //   .attr("cy", value => value * 2)
    //   .attr("stroke", "red");
    svg
      .append('g')
      .selectAll("path")
      .data([data])
      .join("path")
      .attr("d", d => myArea(d))
      .attr("fill", "tomato")
      .attr("stroke", "blue")
      .attr('transform', `translate(${dimensions.marginLeft}, ${0})`)
  }, [data]);

  return (
    <>
      <div style={{
        'position':'relative',
        'top': '150px'
      }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
      <br />
      </div>
      
    </>
  );
}

export default AreaChart;
