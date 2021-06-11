import React, {useState} from 'react';
import styled from 'styled-components';
import IMapView from 'esri/views/MapView';

import TopHeader from '../TopHeader/TopHeader';
import MView from '../MView/MView';
import TimeSlider from '../TimeSlider/TimeSlider';
import MapViewControl from '../../containers/MapViewControl/MapViewControl';

export interface IState{
  layers: string[];
  mapView?:IMapView;
}

const App:React.FC<{}> = ({}) =>{

  

    

  return (
  <div>
    <MView>
      <TimeSlider />
    </MView>
     

  </div>);
};

export default App;




