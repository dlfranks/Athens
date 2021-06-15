import React from 'react';
import {loadModules, loadCss} from 'esri-loader';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IFeatureLayerView from 'esri/views/layers/FeatureLayerView';
import IMapView from 'esri/views/MapView';
import TimeSlider from '../TimeSlider/TimeSlider';

interface Props {
  children?:React.ReactNode;
}

const MView:React.FC<Props> = ({
  children
}:Props) =>{

  const [mapView, setMapView] = React.useState<IMapView>(null);
  const [featureLayers, setFeatureLayers] = React.useState<IFeatureLayer[]>();
  const [featureService, setFeatureService] = React.useState<IFeatureLayerView>();
  const mapViewRef = React.useRef<HTMLDivElement>();
  
  let layerServices:()=>IFeatureLayerView = null;
  const serverUrl =[
    "https://gis1imcloud1.amec.com/arcgis/rest/services/6466/Caltrans/MapServer/3",
    "https://gis1imcloud1.amec.com/arcgis/rest/services/6466/Caltrans/FeatureServer/8"
    
  
  ];
    let layerCount = 8;
    let layerUrls:string[] = [];

    // for(let i = 0; i < layerCount; i++){
    //     layerUrls.push(serverUrl);
    // }

  layerUrls = serverUrl;
  const initMapView = async() => {
    
      loadModules([
        'esri/views/MapView',
        'esri/Map',
        'esri/layers/FeatureLayer',
        'esri/geometry/Extent',
        'esri/form/elements/FieldElement',
        'esri/form/FormTemplate',
        'esri/views/layers/FeatureLayerView',
        'esri/tasks/support/FeatureSet',
        "esri/core/promiseUtils",
      ], {css:true}).then(([
          MapView, 
          Map, 
          FeatureLayer, 
          Extent, 
          FieldElement, 
          FormTemplate, 
          FeatureLayerView,
          FeatureSet,
          PromiseUtils 
        ]) => {

        try{
          const map = new Map({
            basemap: "streets-vector"
            });
            
            var bound = new Extent ({
            "xmin":-9279203,
            "ymin":4018851,
            "xmax":-9279173,
            "ymax":4018999,
            "spatialReference":{"wkid":3785}
            });
            
            const view:typeof MapView = new MapView({
            map: map,
            container: mapViewRef.current,
            center: [-120.15, 37.50],
            zoom: 7
            });
  
          const featureLayers: typeof FeatureLayerView[] = [];
          for(let i = 0; layerUrls.length > i; i++){
            const featureLayer = new FeatureLayer({
                //url: "https://gis1imcloud1.amec.com:6443/arcgis/rest/services/6466/LD_Athens/FeatureServer/" + i,
                url:layerUrls[i],
                id: i,
                outFields:["*"],
              //   formTemplate:new FormTemplate( {
              //   title:"Title",
              //   description: "description",
              //   elements:[
              //     new FieldElement({
              //       type:"field",
              //       fieldName: "OBJeCTID",
              //       label: "OBJECTID",
              //       visibilityExpression:"alwaysHidden"
          
              //     }),
              //     new FieldElement({
              //       type:"field",
              //       fieldName: "ID",
              //       label: "ID",
          
              //     }),
              //     new FieldElement({
              //       type:"field",
              //       fieldName: "Name",
              //       label:"Name",
          
              //     }),
              //   new FieldElement({
              //     type:"field",
              //     fieldName: "Date_LastEdited",
              //     label: " Date LastEdited"
              //   })
              //   ]
                
              // })
            
            });

            map.add(featureLayer);
            
            featureLayers.push(featureLayer);
            if(i == 1){
              view.whenLayerView(featureLayer).then(function(resultView:IFeatureLayerView){
                setFeatureService(resultView);
              }).catch(function(){

              })
            }
            
            
          
          }
          // layerServices = function getLayerViews () {
          //   return PromiseUtils.eachAlways(featureLayers.map(function(layer){
          //    return view.whenLayerView(layer);
          //   }));
          //}
          
          view.when(() => {
            setMapView(view);
            
          });

          

        }catch(err){
          console.error(err);
        }
        
        const createData = () => {

        }
        
      });
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
          top: 50,
          left: 0,
          bottom:0,
          width: '100%',
          // height: '100%',
      }}>

      </div>
      {<TimeSlider mapView={mapView} layerService={featureService}/>}
      {/* {
        React.Children.map(children, (child) => {
          return React.cloneElement(child as React.ReactElement<any>, {
            mapView, setFeatureService
          });
        })
      } */}
    </>);
};

export default MView;
