import React from 'react';
import {loadModules} from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IFeatureSet from 'esri/tasks/support/FeatureSet'
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IFeatureLayerView from 'esri/views/layers/FeatureLayerView';
import {IQueryParam, ITimeSliderDates, queryName} from '../MView/MView';
import {ISelectedSet} from '../SelectedBy/SelectedBy';



 
interface IProps {
    mapView?:IMapView;
    layerService?: IFeatureLayerView;
    selectedSet: ISelectedSet;
    mapViewControl: () => void;
    setTimeSliderDates: (sliderDates:ITimeSliderDates) => void;
}

export default function TimeSliderView ({mapView = null, layerService, mapViewControl, selectedSet, setTimeSliderDates}:IProps){

  const timeSliderRef = React.useRef<HTMLDivElement>();


    
    const initTimeSliderView = async() => {
        
        loadModules(['esri/widgets/TimeSlider', 
        "esri/layers/FeatureLayer",
        "esri/widgets/Legend",
        "esri/widgets/Expand",
        "esri/core/watchUtils",
        "esri/core/promiseUtils",
        'esri/TimeExtent'
        ]).then(([TimeSlider, FeatureLayer, Legend, Expand,  watchUtils, promiseUtils, TimeExtent]) => {
        // create a new instance of timeslider
        const timeSlider = new TimeSlider({
          container: timeSliderRef.current,
          view: mapView,
          mode:"time-window",
          fullTimeExtent: { // entire extent of the timeSlider
            start: new Date(2015, 6, 28),
            end: new Date(2018, 8, 28)
          },
          playRate:2000,
          stops:{
            interval:{
              value:3,
              unit:"months"
            }
          },
          values:[
            new Date(2015, 6, 28),
            new Date(2017, 8, 28)
          ]
        });
        
        setTimeSliderDates(timeSlider.timeExtent);
        mapView.ui.add(timeSliderRef.current, "manual");

        timeSlider.watch("timeExtent", function(timeExtent: typeof TimeExtent){
          const start:Date = new Date(timeExtent.start);
          const end:Date = new Date(timeExtent.end);
          
          setTimeSliderDates({start:start, end: end});
          
          mapViewControl();
        });

        
      });
    }
    
    React.useEffect(() => {
      if(mapView && layerService)
        initTimeSliderView();
    }, []);
      
    

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
