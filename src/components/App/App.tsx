import React from 'react';

import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Extent from "@arcgis/core/geometry/Extent";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Element from "@arcgis/core/form/elements/Element";
import FormTemplate from '@arcgis/core/form/FormTemplate';
import FieldElement from '@arcgis/core/form/elements/FieldElement';

import AppCSS from './App.css';

const App:React.FC<{}> = ({}) =>{

  const mapViewRef = React.useRef<HTMLDivElement>();
  const initMapView = async() => {
    try{
      const inspectionLayer = new FeatureLayer({
        url: "https://gis1imcloud1.amec.com:6443/arcgis/rest/services/6466/LD_Athens/FeatureServer/0",
        id: "inspection",
        outFields:["*"],
        formTemplate:new FormTemplate( {
          title:"Title",
          description: "description",
          elements:[
            new FieldElement({
              type:"field",
              fieldName: "OBJeCTID",
              label: "OBJECTID",
              visibilityExpression:"alwaysHidden"
    
            }),
            new FieldElement({
              type:"field",
              fieldName: "ID",
              label: "ID",
    
            }),
            new FieldElement({
              type:"field",
              fieldName: "Name",
              label:"Name",
    
            }),
          new FieldElement({
            type:"field",
            fieldName: "Date_LastEdited",
            label: " Date LastEdited"
          })
          ]
          
      })
    
    });
    // set columns used to generate grid
    
    
    const roomsLayer = new FeatureLayer({
       url:"https://gis1imcloud1.amec.com:6443/arcgis/rest/services/6466/LD_Athens/FeatureServer/6",
        id: "rooms",
        outFields:["*"],
    
    });
    
    
    const map = new EsriMap({
    basemap: "streets-vector"
    });
    
    var bound = new Extent ({
    "xmin":-9279203,
    "ymin":4018851,
    "xmax":-9279173,
    "ymax":4018999,
    "spatialReference":{"wkid":3785}
    });
    
    const view = new MapView({
    map: map,
    container: mapViewRef.current,
    extent: bound,
    zoom: 18
    });
    
    map.add(inspectionLayer);
    map.add(roomsLayer);
    }catch(err){
      console.error(err);
    }
  };
  
  React.useEffect(() => {
    initMapView();
  }, []);
  return (
  <>
  <div 
  ref={mapViewRef}
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom:0,
    width: '100%',
    // height: '100%',
}}>

  </div>
  </>);
};

export default App;




