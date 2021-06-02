import React from 'react';

import styled from 'styled-components';

import AppCSS from './App.css';
import MView from '../MView/MView';
import Button from 'calcite-react/Button';


const App:React.FC<{}> = ({}) =>{

  const HeaderDiv = styled.div`
    height: 30px;
    padding: 0 2rem;
    display: flex;
`;
  const loader = document.createElement("calcite-loader");
  document.body.appendChild(loader);
  loader.active = true;

  return (
  <>
    <div></div>
    
    <MView/>
  </>);
};

export default App;




