import React from 'react';
import { scaleBand, scaleLinear, select, max,  axisLeft, axisBottom} from 'd3';
import { IDataSet } from '../MView/MView';


const width = 400;
const height = 300;
// const data = [
//     {name:'Phase 1', count: 100},
//     {name:'Phase 2', count: 200},
//     {name:'Phase 3', count: 300},
//     {name:'Phase 4', count: 220}
    
// ];

const dimensions = {
    width: 300,
    height:300,
    charWidth: 250,
    charHeight: 200,
    marginLeft: 50,
    marginBottom: 50,
}
interface IProps{
    width: number,
    height: number,
    data:IDataSet[]
}


const BarChart:React.FC<IProps> = ({width, height, data}: IProps) => {
    
    const barChartRef = React.useRef<SVGSVGElement>();
    
    const init = () => {
        const selection = select(barChartRef.current);
        // selection.append('rect')
        //                     .attr('width', dimensions.width)
        //                     .attr('height', dimensions.height)
        //                     .attr('fill', 'orange');
        
        const maxValue = max(data, data => data.count);
        const y = scaleLinear()
                    .domain([0, maxValue])
                    .range([dimensions.charHeight, 0]);

        const x = scaleBand()
                    .domain(data.map(d => d.name))
                    .range([0, dimensions.charWidth])
                    .paddingInner(.1)
                    .paddingOuter(.1);
                    
        const yAxis = axisLeft(y).ticks(3).tickFormat(d => `${d} %`);
        const xAxis = axisBottom(x);

        const xAxisGroup = selection
                                .append('g')
                                .attr('transform', `translate(${dimensions.marginLeft}, ${dimensions.charHeight+10})`)
                                .call(xAxis);
        const yAxisGroup = selection
                                .append('g')
                                .attr('transform', `translate(${dimensions.marginLeft}, ${10})`)
                                .call(yAxis);
        selection.append('g')
            .attr('transform', `translate(${dimensions.marginLeft}, ${10})`)
            .selectAll('rect').data(data).enter().append('rect')
            .attr('width', x.bandwidth)
            .attr('height', (d)=> {
                return dimensions.charHeight - y(d.count);
            })
            .style('border','1px solid black')
            .style('background', 'white')
            .style('fill', '#0099ff')
            .attr('x', d => x(d.name)!)
            .attr('y', d => y(d.count))
            //.append('rect').attr('width', 5).attr('height', 10).attr('fill', 'blue');
            console.log(selection)

        
    }
    React.useEffect(() => {
        
        init();
    }, [])
    return(
        <div style={{
            'position':'relative',
            'top': '150px'
        }}>
            <svg ref={barChartRef} width={dimensions.width} height={dimensions.height}/>
        </div>
            
    );
}

export default BarChart;