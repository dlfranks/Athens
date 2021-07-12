import React from 'react';
import { scaleBand, 
        scaleLinear, 
        select, 
        max,  
        axisLeft, 
        axisBottom,
        area,
        stack,
        scalePoint,
        stackOrderAscending,
        curveCardinal} from 'd3';



interface StackedAreaModel{
    year: string,
    stack1: number,
    stack2: number,
    stack3: number

}
const width = 400;
const height = 300;
const data:StackedAreaModel[] = [
    {year: '2015', stack1: 30, stack2: 70, stack3: 100},
    {year: '2016', stack1: 50, stack2: 90, stack3: 120},
    {year: '2017', stack1: 20, stack2: 100, stack3: 120},
    {year: '2018', stack1: 10, stack2: 30, stack3: 90},
    
    
];

const keys = ['stack1', 'stack2', 'stack3'];
const colors = {stack1: 'green', stack2: 'orange', stack3: 'purple'};

const dimensions = {
    width: 300,
    height:300,
    charWidth: 250,
    charHeight: 200,
    marginLeft: 50,
    marginBottom: 50,
}
interface IProps{
    
    
}


const StackedAreaChart:React.FC<IProps> = ({}: IProps) => {
    
    const barChartRef = React.useRef<SVGSVGElement>();
    
    const init = () => {
        const svg = select(barChartRef.current);
        
        
        const stackGenerator = stack<StackedAreaModel>()
                                .keys(keys)
                                .order(stackOrderAscending);
        const layers = stackGenerator(data);
        const extent = [
            0,
            max(layers, layer => max(layer, sequence => sequence[1]))
        ];

        // scales
        const xScale = scalePoint()
                    .domain(data.map(d => d.year))
                    .range([0, dimensions.charWidth])
                    

        const yScale = scaleLinear()
                    .domain(extent)
                    .range([dimensions.charHeight, 0]);

        const areaGenerator = area<{
            0:number;
            1:number;
            data:StackedAreaModel
        }>()
        .x(sequence => xScale(sequence.data.year))
        .y0(sequence => yScale(sequence[0]))
        .y1(sequence => yScale(sequence[1]))
        .curve(curveCardinal);

        // rendering
        svg
        .selectAll(".layer")
        .data(layers)
        .join("path")
        .attr('transform', `translate(${dimensions.marginLeft}, ${10})`)
        .attr("class", "layer")
        .attr("fill", layer => colors[layer.key])
        .attr("d", areaGenerator)

                    
        const yAxis = axisLeft(yScale);
        const xAxis = axisBottom(xScale);

        const xAxisGroup = svg
                                .append('g')
                                .attr('transform', `translate(${dimensions.marginLeft}, ${dimensions.charHeight+10})`)
                                .call(xAxis);
        const yAxisGroup = svg
                                .append('g')
                                .attr('transform', `translate(${dimensions.marginLeft}, ${10})`)
                                .call(yAxis);
        
        
    }
    React.useEffect(() => {
        
        init();
    }, [])
    return(
        <div >
            <div style={{
                'position':'relative',
                'top': '150px'
            }}>
                <svg ref={barChartRef} width={dimensions.width} height={dimensions.height}/>
            </div>
            
        </div>   
    );
}

export default StackedAreaChart;