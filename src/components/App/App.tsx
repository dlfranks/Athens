import React, {useState} from 'react';
import styled from 'styled-components';
import IMapView from 'esri/views/MapView';

import TopHeader from '../TopHeader/TopHeader';
import MView from '../MView/MView';
import StackedBarChart from '../StackedBarChart/StackedBarChart';
import MapViewControl from '../../containers/MapViewControl/MapViewControl';
import LineChart from '../LineChart/LineChart';
import AreaChart from '../AreaChart/ArearChart';
import StackedAreaChart from '../StackedAreaChart/StackedAreaChart';
import MapView from 'esri/views/MapView';

export interface IState{
  layers: string[];
  mapView?:IMapView;
}

const App:React.FC<{}> = ({}) =>{

  

    

  return (
  <div>
    <TopHeader/>
    <MView/>
    {/* <StackedBarChart/>
    <LineChart/>  
    <AreaChart/>  
    <StackedAreaChart/>   */}
     

  </div>);
};

export default App;




