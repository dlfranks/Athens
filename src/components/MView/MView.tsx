import React from 'react';
import {loadModules, loadCss} from 'esri-loader';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IFeatureLayerView from 'esri/views/layers/FeatureLayerView';
import IFeatureSet from 'esri/tasks/support/FeatureSet';
import IMapView from 'esri/views/MapView';
import TimeSlider from '../TimeSlider/TimeSlider';
import { convertDateFormatToIntlOptions } from 'esri/intl';
import SelectedBy, {ISelectedSet} from '../SelectedBy/SelectedBy';

export const queryName = "Status";
export interface IQueryParam {
  layerView: IFeatureLayerView;
  startDate: Date;
  endDate: Date;
  columnName: string;
  columnValue: string;
}

export interface ITimeSliderDates{
  start?:Date;
  end?: Date;
}
export interface IDataSet{
  name:string;
  count:number;
}
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
  const [featureLayers, setFeatureLayers] = React.useState<IFeatureLayer[]>(null);
  const [featureService, setFeatureService] = React.useState<IFeatureLayerView>();
  const [selectedSet, setSelectedSet] = React.useState<ISelectedSet>({name:queryName, value:"all"});
  const [barDataSet, setBarDataSet] = React.useState<IDataSet[]>();
  const [countFeatures, setCountFeatures] = React.useState<number>();
  const [timeSliderDates, setTimeSliderDates] = React.useState<ITimeSliderDates>(TimeSliderDates);
  const [selectedOptionData, setSelectedOptionData] = React.useState<string[]>([]);
  const mapViewRef = React.useRef<HTMLDivElement>();
  
  
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
  
          const layers: typeof FeatureLayer[] = [];
          for(let i = 0; layerUrls.length > i; i++){
            const layer = new FeatureLayer({
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

            map.add(layer);
            
            layers.push(layer);
            if(i == 1){
              view.whenLayerView(layer).then(function(resultView:IFeatureLayerView){
                
                setFeatureService(resultView);
                
                
              }).catch(function(err:any){
                console.log(`Feature Service Error: ${err}`)
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

          setFeatureLayers(layers);

        }catch(err){
          console.error(err);
        }
        
        
        
      });
  };

  
  const TimeSliderWidget = () => {
    if(mapView ==null || featureLayers == null || featureService == null || selectedOptionData.length < 1)
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
          options = {selectedOptionData}
          onClickCount = {clickCount}
          selectedValue = {selectedSet}
          countFeatures = {countFeatures}
          barData = {barDataSet}
          />
        </>
    )
  }

  const createBarChartData = () => {
    
    const years = ['2015', '2016', '2017', '2018'];
    const whereString = createWhere();
    const query = featureService.createQuery();
    query.where = whereString;
    const dataSet:IDataSet[] = [];
    
    featureService.queryFeatures(query).then((results) => {
      const features = results.features;
      for(let i = 0; i < years.length; i++){
        let startDate
        let filtered = features.filter(g => {
          return g.attributes.Date_Created.getYear() == years[i];
        });
        let data = {name:years[i], count: filtered? 0 : filtered.length}
        dataSet.push(data);
      }
      
    });
  };

  const createOptions = () => {
    const queryString = createWhere();
    const uniqueValues:string[] =['all'];
    const query = featureLayers[1].createQuery();
    query.where = queryString;
    featureLayers[1].queryFeatures(query).then((response) =>{
      let features = response.features;
      let statusItems = features.map((f) => {
        return f.attributes.Status;
      });

      statusItems.forEach((item) => {
        
        if((uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) && item != ""){
          uniqueValues.push(item);
        }
      });
       if(uniqueValues.length > 0){
         setSelectedSet({name:queryName, value:uniqueValues[0]});
       }
       setSelectedOptionData(uniqueValues);

      
      

    });

    
  }

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
  
  const layerViewQueryFeature = (whereString:string): Promise<IFeatureSet>=> {
    const query = featureService.createQuery();
    query.where = whereString;
    query.outFields = featureService.availableFields;
    return featureService.queryFeatures(query);
  }
  const mapViewControl = ():void => {

    const whereString = createWhere();
    featureService.layer.definitionExpression = whereString;
    
  }
  const changeSelect = (selectedValue : string) => {
    setSelectedSet({...selectedSet, value:selectedValue})
    
    //mapViewControl();
  }

  const clickCount = () => {
    if(!featureService && !selectedSet && !timeSliderDates){
      setCountFeatures(0);
    
    }

    const whereString = createWhere()

    layerViewQueryFeature(whereString).then((results) => {
      setCountFeatures(results.features.length);
    });
  }

  React.useEffect(() => {
    initMapView();
    
  }, []);

  React.useEffect(() => {
    if(featureLayers && featureLayers.length > 1)
      createOptions();
    
  }, [featureLayers]);

  React.useEffect(() => {
    if(featureService && timeSliderDates && selectedSet)
      mapViewControl();
    
  }, [timeSliderDates, selectedSet]);

  

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
      
      {TimeSliderWidget()}
    </>);
};

export default MView;
