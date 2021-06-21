import React from 'react';
import {loadModules} from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IFeatureSet from 'esri/tasks/support/FeatureSet'
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IFeatureLayerView from 'esri/views/layers/FeatureLayerView';
 
interface Props {
    mapView?:IMapView;
    layerService?: IFeatureLayerView;
}
interface QueryParam {
  layerView: IFeatureLayerView;
  startDate: Date;
  endDate: Date;
}
export default function TimeSliderView ({mapView = null, layerService}:Props){

  const timeSliderRef = React.useRef<HTMLDivElement>();


    
    const initTimeSliderView = async() => {
        
        loadModules(['esri/widgets/TimeSlider', 
        "esri/layers/FeatureLayer",
        "esri/widgets/Legend",
        "esri/widgets/Expand",
        "esri/core/watchUtils",
        "esri/core/promiseUtils",
        ]).then(([TimeSlider, FeatureLayer, Legend, Expand,  watchUtils, promiseUtils]) => {
        // create a new instance of timeslider
        const timeSlider = new TimeSlider({
          container: timeSliderRef.current,
          view: mapView,
          mode:"time-window",
          fullTimeExtent: { // entire extent of the timeSlider
            start: new Date(2015, 7, 28),
            end: new Date(2018, 9, 28)
          },
          values:[ // location of timeSlider thumbs
            new Date(2015, 7, 28),
            new Date(2018, 9, 28)
          ]
        });

        mapView.ui.add(timeSliderRef.current, "manual");

        timeSlider.watch("timeExtent", function(){
          const start:Date = new Date(timeSlider.timeExtent.start);
          const end:Date = new Date(timeSlider.timeExtent.end);
          
          const query: QueryParam = {layerView:layerService, startDate:start, endDate:end}
          updateFeaturesOnMapViewState(query);
        });

        
      });
    }
     
    const updateFeaturesOnMapViewState = ({layerView, startDate, endDate}: QueryParam) => {
      
      let start = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + (startDate.getDate()+1); 
      let end = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + (endDate.getDate()+1); 
      let whereString = "where Date_Created >= DATE '" + start + "' and Date_Created <= DATE '" + end + "'";
      layerView.queryFeatures({where:whereString, outFields:layerView.availableFields}).then(function(results){
        let graphics = results.features;
        console.log(results.features.length, " features returned");

      }).catch(function(error){
        console.log("query failed: ", error)
      }); 

          
          
      
    }

    React.useEffect(() => {
      if(mapView && layerService)
        initTimeSliderView();
    }, [mapView]);
      
    

    return(
    <>
      <div ref={timeSliderRef} 
      style={{
        'position': 'absolute',
        'width':'100%',
        'bottom':'0'

      }}>

      </div>
    </>);

}
