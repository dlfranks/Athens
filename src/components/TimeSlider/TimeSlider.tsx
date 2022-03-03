import React from 'react';
import {loadModules} from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IFeatureSet from 'esri/tasks/support/FeatureSet'
import IFeatureLayer from 'esri/layers/FeatureLayer';
import IFeatureLayerView from 'esri/views/layers/FeatureLayerView';
import {ISelectedSet} from '../SelectedBy/SelectedBy';
import {ITimeSliderDates} from '../MView/MView';


 
interface IProps {
    mapView?:IMapView;
    timeExtendDates: ITimeSliderDates;
    setTimeSliderDates: (sliderDates:ITimeSliderDates) => void;
}

export default function TimeSliderView ({mapView = null, timeExtendDates, setTimeSliderDates}:IProps){

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
            start:new Date(2019, 1, 10),
            end:new Date(2019, 3, 20)
          },
          playRate:2000,
          stops:{
            interval:{
              value:7,
              unit:"days"
            }
          },
          values:[
            timeExtendDates.start,
            timeExtendDates.end
          ]
        });
        
        //setTimeSliderDates(timeSlider.timeExtent);
        mapView.ui.add(timeSliderRef.current, "manual");

        timeSlider.watch("timeExtent", function(timeExtent: typeof TimeExtent){
          let start:Date = new Date(timeExtent.start);
          let end:Date = new Date(timeExtent.end);
          
          console.log({'start': start, 'end': end});
          setTimeSliderDates({...timeExtendDates, start:start, end: end});
          
          //mapViewControl();
        });

        
      });
    }
    
    React.useEffect(() => {
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
