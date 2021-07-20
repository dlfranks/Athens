import React from 'react';
import {loadModules, loadCss} from 'esri-loader';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IFeatureLayerView from 'esri/views/layers/FeatureLayerView';
import IFeatureSet from 'esri/tasks/support/FeatureSet';
import IMap from 'esri/Map';
import IMapView from 'esri/views/MapView';
import IExtent from 'esri/geometry/Extent';
import IPromiseUtils, { resolve } from 'esri/core/promiseUtils';
import TimeSlider from '../TimeSlider/TimeSlider';
import { convertDateFormatToIntlOptions } from 'esri/intl';
import SelectedBy, {ISelectedSet} from '../SelectedBy/SelectedBy';
import { Module } from 'webpack';
import {UpdateLayerName} from '../../types/';

export const queryName = "Status";
export type FeatureService ={
  name:string;
  layer: IFeatureLayer;
  layerView: IFeatureLayerView;
  
}
export interface FeatureServiceInfo {
  [key: string] : FeatureService;
}
export interface ITimeSliderDates{
  start?:Date;
  end?: Date;
}
export interface IDataSet{
  name:string;
  count:number;
}
interface ILayerUrl{
  id:string;
  url:string;
}
const updateLayers = ['Fuel Storage Operations','ICEngine', 'ODS', 'Boiler Heating Unit', 'Misc', 'Inspections']


const TimeSliderDates: ITimeSliderDates = {
  start:new Date(2015, 6, 28),
  end:new Date(2018, 8, 28)
}
interface IProps {
  children?:React.ReactNode;
}

const MView:React.FC<IProps> = ({
  children
}:IProps) =>{

  const [mapView, setMapView] = React.useState<IMapView>(null);
  const [featureServices, setFeatureServices] = React.useState<FeatureServiceInfo>(null);
  const [selectedSet, setSelectedSet] = React.useState<ISelectedSet>({name:queryName, value:"all"});
  const [barDataSet, setBarDataSet] = React.useState<IDataSet[]>();
  const [countFeatures, setCountFeatures] = React.useState<number>();
  const [timeSliderDates, setTimeSliderDates] = React.useState<ITimeSliderDates>(TimeSliderDates);
  const [selectedOptionData, setSelectedOptionData] = React.useState<string[]>([]);
  const mapViewRef = React.useRef<HTMLDivElement>();
  
  
  const baseUrl = 'https://gis1imcloud1.amec.com/arcgis/rest/services/6466/AEI_Lejeune/FeatureServer/'
  const layerNum = 9;
  const layerCount = 8;
  const layerUrls:ILayerUrl[] = [
      {
        id :'Fuel Storage Operations',
        url: baseUrl + '0'
      },
      {
        id :'ICEngine',
        url: baseUrl + '1'
      },
      {
        id :'ODS',
        url: baseUrl + '2'
      },
      {
        id :'Boiler Heating Unit',
        url: baseUrl + '3'
      },
      {
        id :'Misc',
        url: baseUrl + '4'
      },
      {
        id :'Buildings',
        url: baseUrl + '6'
      },
      {
        id :'Hazardous Chemicals',
        url: baseUrl + '7'
      },
      {
        id :'Inspections',
        url: baseUrl + '8'
      },
      {
        id :'Boundary',
        url: baseUrl + '9'
      },
    ];

    

    // for(let i = 0; i < layerCount; i++){
    //     layerUrls.push(baseUrl + i);
    // }

  
  const initMapView = async() => {
    
    // type Modules = [typeof IMapView, typeof IMap, typeof IFeatureLayer, typeof IExtent, typeof IPromiseUtils];
      
    // const [
    //   MapView, 
    //   Map, 
    //   FeatureLayer, 
    //   Extent, 
    //   promiseUtils 
    // ] = await (loadModules([
    //   'esri/views/MapView',
    //   'esri/Map',
    //   'esri/layers/FeatureLayer',
    //   'esri/geometry/Extent',
    //   "esri/core/promiseUtils",
    // ]) as Promise<Modules>);
    loadModules(['esri/views/MapView',
       'esri/Map',
       'esri/layers/FeatureLayer',
      'esri/geometry/Extent',
      "esri/core/promiseUtils",
        ]).then(([MapView, 
          Map, 
          FeatureLayer,
          Extent, 
          promiseUtils ]) => {
    try{

      const map = new Map({
        basemap: "streets-vector"
        });
        
      var bound = new Extent ({
          "xmin":-8652157.46053707,
          "ymin":4104570.290565183,
          "xmax": -8577968.474010149,
          "ymax": 4136259.5862388243,
          "spatialReference":{"wkid":3785}
      });
        
      const view = new MapView({
        map: map,
        container: mapViewRef.current,
        extent: bound,
        zoom:12
      });

      view.when(() => {
          setMapView(view);
          
      });

      const layers: FeatureService[] = [];
      //Looping through layers
      promiseUtils.eachAlways(layerUrls.map((layer) => {

        var fLayer = new FeatureLayer({
          url:layer.url,
          id: layer.id,
          outFields:["*"],
        });

        map.add(fLayer);
        return view.whenLayerView(fLayer).then(function(resultView:IFeatureLayerView){
          let service: FeatureService ={
            name: fLayer.id,
            layer: fLayer,
            layerView: resultView
          }
          
          layers.push(service);
          return service;
        });
      })).then((result:any) => {
        const obj: FeatureServiceInfo = {};
        // result.map((layer:FeatureService) => {
        //   obj[layer.name] = layer;
        // });
        // setFeatureServices(obj);
      });
      
    }catch(err){

      console.log('Error loading map view: ') + err;

    }

  }); //loadmodules
    
  }
        

          

  
  const TimeSliderWidget = () => {
    if(mapView ==null || featureServices == null || selectedOptionData.length < 1)
    {
      return null;
    }

    return (
      
      <>
      
        <TimeSlider 
          mapView={mapView} 
          timeExtendDates={timeSliderDates} 
          setTimeSliderDates = {setTimeSliderDates}
          />
          {/* <SelectedBy
          onChange ={changeSelect}
          options = {selectedOptionData}
          onClickCount = {clickCount}
          selectedValue = {selectedSet}
          countFeatures = {countFeatures}
          barData = {barDataSet}
          /> */}
        </>
    )
  }

  // const createBarChartData = () => {
    
  //   const years = ['2015', '2016', '2017', '2018'];
  //   const whereString = createWhere();
  //   const query = featureService.createQuery();
  //   query.where = whereString;
  //   const dataSet:IDataSet[] = [];
    
  //   featureService.queryFeatures(query).then((results) => {
  //     const features = results.features;
  //     for(let i = 0; i < years.length; i++){
  //       let startDate
  //       let filtered = features.filter(g => {
  //         return g.attributes.Date_Created.getYear() == years[i];
  //       });
  //       let data = {name:years[i], count: filtered? 0 : filtered.length}
  //       dataSet.push(data);
  //     }
      
  //   });
  //};

  // const createOptions = () => {
  //   const queryString = createWhere();
  //   const uniqueValues:string[] =['all'];
  //   const query = featureLayers[1].createQuery();
  //   query.where = queryString;
  //   featureLayers[1].queryFeatures(query).then((response) =>{
  //     let features = response.features;
  //     let statusItems = features.map((f) => {
  //       return f.attributes.Status;
  //     });

  //     statusItems.forEach((item) => {
        
  //       if((uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) && item != ""){
  //         uniqueValues.push(item);
  //       }
  //     });
  //      if(uniqueValues.length > 0){
  //        setSelectedSet({name:queryName, value:uniqueValues[0]});
  //      }
  //      setSelectedOptionData(uniqueValues);

      
      

  //   });

    
  // }

  const attachZero = (n:number):string => {
    return n < 10? ("0" + n) : n.toString();
  } 
  const createWhere = ():string => {
    let whereString="";
    let start = timeSliderDates.start.getFullYear() + "-" + attachZero(timeSliderDates.start.getMonth()+1) + "-" + attachZero(timeSliderDates.start.getDate()+1); 
    let end = timeSliderDates.end.getFullYear() + "-" + attachZero(timeSliderDates.end.getMonth()+1) + "-" + attachZero(timeSliderDates.end.getDate()+1); 
    if(selectedSet.value === 'all'){
      whereString = `Date_Created >= DATE '${start}' and Date_Created <= DATE '${end}'`;
    }else{
      whereString = `Date_Created >= DATE '${start}' and Date_Created <= DATE '${end}' and ${selectedSet.name} = '${selectedSet.value}'`;
    }
    
    return whereString;
  }
  
  const layerViewQueryFeature = (layerView:IFeatureLayerView, whereString:string): Promise<IFeatureSet>=> {
    const query = layerView.createQuery();
    query.where = whereString;
    query.outFields = layerView.availableFields;
    return layerView.queryFeatures(query);
  }
  const mapViewControl = ():void => {

    const whereString = createWhere();
    updateLayers.forEach(layer => {

      featureServices[layer].layerView.layer.definitionExpression = whereString;
    });
    
    
  }
  const changeSelect = (selectedValue : string) => {
    setSelectedSet({...selectedSet, value:selectedValue})
    
    //mapViewControl();
  }

  // const clickCount = () => {
  //   if(!featureService && !selectedSet && !timeSliderDates){
  //     setCountFeatures(0);
    
  //   }

  //   const whereString = createWhere()

  //   layerViewQueryFeature(whereString).then((results) => {
  //     setCountFeatures(results.features.length);
  //   });
  // }

  React.useEffect(() => {
    initMapView();
    
  }, []);

  // React.useEffect(() => {
  //   if(featureLayers && featureLayers.length > 1)
  //     createOptions();
    
  // }, [featureLayers]);

  React.useEffect(() => {
    if(featureServices && timeSliderDates && selectedSet)
      mapViewControl();
    
  }, [timeSliderDates, selectedSet]);

  

  return (
    <>
      <div 
        ref={mapViewRef}
        style={{
          position:"absolute",
          padding:0,
          margin:0,
          top:0,
          left:0,
          width: '100%',
          height: '100%',
      }}>

      </div>
      
      {TimeSliderWidget()}
    </>);
};

export default MView;
