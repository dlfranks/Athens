import React from 'react';
import styled from 'styled-components';
import {CalciteH4} from 'calcite-react/Elements';

  import Button from 'calcite-react/Button';

  const TopNavContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 50px};
    width: 100%;
    box-sizing: border-box;
    padding: .25rem 1rem;
    z-index: 5;
    background: #0079c1};
    color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const TitleText = styled(CalciteH4)`
    margin: 0;
    padding-right: .75rem;
    margin-right: .75rem;
    border-right: 1px solid rgba(255,255,255,.75);
`;

const TopHeader:React.FC<{}> = ({}) => {

    return(<>
        <TopNavContainer>
          <TitleText> Athens </TitleText>
        </TopNavContainer>
    </>);
  };

export default TopHeader;  

  
  