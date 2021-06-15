import React, {useState} from 'react';
import styled from 'styled-components';
import IMapView from 'esri/views/MapView';

import TopHeader from '../TopHeader/TopHeader';
import MView from '../MView/MView';

import MapViewControl from '../../containers/MapViewControl/MapViewControl';

export interface IState{
  layers: string[];
  mapView?:IMapView;
}

const App:React.FC<{}> = ({}) =>{

  

    

  return (
  <div>
    <TopHeader/>
    <MView>
      
    </MView>
     

  </div>);
};

export default App;




