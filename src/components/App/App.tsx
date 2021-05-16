import React from 'react';
import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Extent from "@arcgis/core/geometry/Extent";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Element from "@arcgis/core/form/elements/Element";
import FormTemplate from '@arcgis/core/form/FormTemplate';
import FieldElement from '@arcgis/core/form/elements/FieldElement';

import AppCSS from './App.css';
import MView from '../MView/MView';

const App:React.FC<{}> = ({}) =>{

  return (
  <>
    <MView/>
  </>);
};

export default App;




