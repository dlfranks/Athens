import React from 'react';
import Select from 'calcite-react/Select';
import Button, { ButtonGroup } from 'calcite-react/Button';
import Modal from 'calcite-react/Modal'
import {MenuItem} from 'calcite-react/Menu';
import styled from 'styled-components';
import BarChart from '../BarChart/BarChart';
import { IDataSet } from '../MView/MView';

export interface ISelectedSet{
    name: string;
    value: string;
}

interface IProps {
    onChange: (value:string) =>void;
    options: string[];
    onClickCount: () => void;
    selectedValue: string;
    countFeatures:number;
    barData:IDataSet[];
}

const StyledSelect = styled(Select)`
    position:relative;
    top:20px;
    left:20px;
    width:200px;
    background-color: #fff;
    color: #000;
    
    
`;


const SelectedBy:React.FC<IProps> = ({onChange, options, onClickCount, selectedValue, countFeatures, barData}:IProps) => {
    const selectRef = React.useRef<HTMLSelectElement>();
    const panelDivRef = React.useRef<HTMLDivElement>();
    const countSpanRef = React.useRef<HTMLSpanElement>();
    const init = () => {
        

        
        let optionItems: typeof MenuItem[] = [];
    }
    React.useEffect(() => {
        init();
    }, []);
    
    return (
        
        <div ref={panelDivRef}
            style={{
                'position': 'relative',
                'width': '400px',
                'height': '600px',
                'top': '30px',
                'right': '30px',
                'background': '#fff',
                'float':'right'
            }}
        >
            <StyledSelect onChange={onChange}
                    selectedValue={selectedValue}
            >
                {
                    options.map((value) => {
            
                        return <MenuItem
                                key = {value}
                                value={value}>
                                    {value}
                            </MenuItem>;
                
                    })
                }
            </StyledSelect>
            <Button onClick={onClickCount}
                style={{
                    'position': 'relative',
                    'top':'70px',
                    'left': '20px',

                }}
            >Total Count</Button>
            <span ref={countSpanRef}
                style={{
                    'position': 'relative',
                    'top':'70px',
                    'left': '100px',
                }}
            >{countFeatures}</span>
            <BarChart data={barData} width={200} height={400}/>
        </div>    
    )
}

export default SelectedBy;
