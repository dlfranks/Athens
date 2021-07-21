import React from 'react';
import {loadModules, loadCss} from 'esri-loader';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IFeatureLayerView from 'esri/views/layers/FeatureLayerView';
import IFeatureSet from 'esri/tasks/support/FeatureSet';
import IMap from 'esri/Map';
import IMapView from 'esri/views/MapView';
import IExtent from 'esri/geometry/Extent';
import IPromiseUtils, { resolve } from 'esri/core/promiseUtils';
import IWatchUtils from 'esri/core/watchUtils';
import TimeSlider from '../TimeSlider/TimeSlider';
import { convertDateFormatToIntlOptions } from 'esri/intl';
import SelectedBy, {ISelectedSet} from '../SelectedBy/SelectedBy';
import { Module } from 'webpack';
import {UpdateLayerName} from '../../types/';
import DirectionsFeatureSet from 'esri/tasks/support/DirectionsFeatureSet';

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
const updateLayerNames = ['Fuel Storage Operations', 'ICEngine', 'ODS', 'Boiler Heating Unit', 'Misc'];
const selectionOptions = ['All'].concat(updateLayerNames);

const TimeSliderDates: ITimeSliderDates = {
  start:new Date(2014, 10, 20),
  end:new Date(2021, 7, 19)
}
interface IProps {
  children?:React.ReactNode;
}

const MView:React.FC<IProps> = ({
  children
}:IProps) =>{

  const [mapView, setMapView] = React.useState<IMapView>(null);
  const [featureServices, setFeatureServices] = React.useState<FeatureServiceInfo>(null);
  const [selectedSet, setSelectedSet] = React.useState<string>(selectionOptions[0]);
  const [barDataSet, setBarDataSet] = React.useState<IDataSet[]>();
  const [countFeatures, setCountFeatures] = React.useState<number>();
  const [timeSliderDates, setTimeSliderDates] = React.useState<ITimeSliderDates>(TimeSliderDates);
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

  
  const initMapView = async() => {
    
    type Modules = [typeof IMapView, typeof IMap, typeof IFeatureLayer, typeof IExtent, typeof IPromiseUtils, typeof IWatchUtils];
      
    const [
      MapView, 
      Map, 
      FeatureLayer, 
      Extent, 
      promiseUtils,
      watchUtils
    ] = await (loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/FeatureLayer',
      'esri/geometry/Extent',
      "esri/core/promiseUtils",
      'esri/core/watchUtils'
    ], {css:true}) as Promise<Modules>);
    
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
          watchUtils.whenFalseOnce(resultView, "updating", () => {
            console.log("updating view");
          });
          layers.push(service);
          return service;
        });
      })).then((results:any) => {
        const obj: FeatureServiceInfo = {};
        results.map((result:any) => {
          var layer = result.value;
          obj[layer.name] = layer;
        });
        setFeatureServices(obj);
        
      });
      
    }catch(err){

      console.log('Error loading map view: ') + err;

    }

 
    
  }
        
  
  
  const TimeSliderWidget = () => {
    if(mapView ==null || featureServices == null)
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
          <SelectedBy
          onChange ={changeSelect}
          options = {selectionOptions}
          onClickCount = {clickCount}
          selectedValue = {selectedSet}
          countFeatures = {countFeatures}
          barData = {barDataSet}
          />
        </>
    )
  }

  const updateBarChart = (data:IFeatureSet[]) => {
    
    const years = ['2015', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];
    
    const dataSet:IDataSet[] = [];
    
    for(let i = 0; i < data.length; i++){
      //DirectionsFeatureSet.push({name:updateLayerNames, count:data[i].length});
    }
  };

  
  const attachZero = (n:number):string => {
    return n < 10? ("0" + n) : n.toString();
  } 
  const createWhere = ():string => {
    
    let start = timeSliderDates.start.getFullYear() + "-" + attachZero(timeSliderDates.start.getMonth()+1) + "-" + attachZero(timeSliderDates.start.getDate()+1); 
    let end = timeSliderDates.end.getFullYear() + "-" + attachZero(timeSliderDates.end.getMonth()+1) + "-" + attachZero(timeSliderDates.end.getDate()+1); 
    
    return `Date_Created >= DATE '${start}' and Date_Created <= DATE '${end}'`;
  }
  
  const layerViewQueryFeature = (serviceName:string, whereString:string): Promise<IFeatureSet>=> {
    const query = featureServices[serviceName].layerView.createQuery();
    query.where = whereString;
    query.outFields = featureServices[serviceName].layerView.availableFields;
    return featureServices[serviceName].layerView.queryFeatures(query);
  }

  const layerViewTasks = () => {
    return updateLayerNames.map(name => {
            return mapView.whenLayerView(featureServices[name].layer);
          });
  };

  const multipleLayerView = () => {
    return new Promise((resolve, reject) =>{
      Promise.all(layerViewTasks()).then((viewResults) => {
        if(!viewResults){
          reject({
            error: 'failed to fetch data'
          });
        }


        resolve({viewResults})
      })
      .catch(error => {
        reject(error.message)
      });
      
    });
  }

  const multipleQueryFeaturesResults = (layerViewResults:IFeatureLayerView[]) => {
    
      return new Promise((resolve, reject) => {

        
        layerViewResults.map((result) => {
          if(!result){
            console.log("Query result error")
          }else{
            const layerView = result;
            const query = layerView.createQuery();

            return layerView.queryFeatures(query).then((response) => {

              return response.features;

            }, (e) => {return resolve(e)})
          }
        });
        Promise.all(featureSetDataTask()).then((featureSetSData) => {
          if(featureSetSData){
            reject({
                error: 'failed to fetch data'
            });

            resolve({featureSetSData});
        }
        })
        .catch((error) => {
          reject(error.message);
        });
      });

    }
    );
  };

  const mapViewControl = ():void => {

    const whereString = createWhere();

    updateLayerNames.forEach(layerName => {
      
      layerViewQueryFeature(layerName, whereString).then((response) => {
        
        const data = response.features;
        //updateBarChart(data);
      },
      (e) =>{

      });
    });
    // if(selectedSet =='All'){
    //   updateLayerNames.forEach(layer => {

    //     featureServices[layer].layerView.layer.definitionExpression = whereString;
    //   });
    // }else{
    //   featureServices[selectedSet].layerView.layer.definitionExpression = whereString;
    // }
    
    
    
  }
  const changeSelect = (selectedValue : string) => {
    setSelectedSet(selectedValue);
    
    //mapViewControl();
  }

  const clickCount = () => {
    if(!featureServices && !selectedSet && !timeSliderDates){
      setCountFeatures(0);
    
    }

    const whereString = createWhere()

    layerViewQueryFeature(selectedSet, whereString).then((results) => {
      setCountFeatures(results.features.length);
    });
  }

  React.useEffect(() => {
    initMapView();
    
  }, []);

  // React.useEffect(() => {
  //   if(featureLayers && featureLayers.length > 1)
  //     createOptions();
    
  // }, [featureLayers]);

  React.useEffect(() => {
    if(featureServices)
      mapViewControl();
    
  }, [timeSliderDates]);

  

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
