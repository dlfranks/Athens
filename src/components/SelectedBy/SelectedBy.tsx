import React from 'react';
import Select from 'calcite-react/Select';
import {MenuItem} from 'calcite-react/Menu';
import styled from 'styled-components';

export interface ISelectedSet{
    name: string;
    value: string;
}

interface IProps {
    onChange: (value:string) =>void;
    options: string[];
    onClickCount: () => void;
    selectedValue: ISelectedSet;
    countFeatures:number;
}

const StyledSelect = styled(Select)`
    position:absolute;
    top:10px;
    right:60px;
    width:200px;
    background-color: #fff;
    color: #000;
    z-index: 5;
    
`;
const SelectedBy = ({onChange, options, onClickCount, selectedValue, countFeatures}:IProps) => {

    const selectRef = React.useRef<HTMLSelectElement>();

    const countDivRef = React.useRef<HTMLDivElement>();
    let optionItems: typeof MenuItem[] = [];
    

    const init = () => {
        
        

    }

    

    React.useEffect(() =>{
        
        init();
    }, []);

    return (
        
        <div>
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
            <div>
                <button onChange={onClickCount}></button>
            </div>
            <div>
                {}
            </div>
        </div>
    )
}

export default SelectedBy;
