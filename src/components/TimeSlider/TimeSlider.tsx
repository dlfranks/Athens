import React from 'react';
import {loadModules} from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IFeatureSet from 'esri/tasks/support/FeatureSet'
 
interface Props {
    view?:IMapView;
}
export default function TimeSlider ({view = null}:Props){

  const timeSliderRef = React.useRef<HTMLElement>();

    const definitions = [
        { id: 0, year: 2014, offset: 4 },
        { id: 1, year: 2015, offset: 3 },
        { id: 2, year: 2016, offset: 2 },
        { id: 3, year: 2017, offset: 1 },
        { id: 4, year: 2018, offset: 0 }
      ];
    // fire stats for each year between 2014 - 2018
    const sumAcres = {
        onStatisticField: "GIS_ACRES",
        outStatisticFieldName: "acres_sum",
        statisticType: "sum"
      };
    const fireCounts = {
        onStatisticField: "OBJECTID",
        outStatisticFieldName: "fire_counts",
        statisticType: "count"
      };
    const year = {
        onStatisticField: "ALARM_DATE",
        outStatisticFieldName: "year",
        statisticType: "max"
      }
      // stats query
      const statQuery = {
        outStatistics: [
          sumAcres,
          fireCounts,
          year
        ],
        timeExtent:{start:new Date(), end:new Date()}

        
      };

    const init= () => {
        if(view){
            updateMapView();
        }
      }
    const updateMapView = async() => {
        
        loadModules(['esri/widgets/TimeSlider', 
        "esri/layers/FeatureLayer",
        "esri/widgets/Legend",
        "esri/widgets/Expand",
        "esri/core/watchUtils",
        "esri/core/promiseUtils",
        ]).then(([TimeSlider, FeatureLayer, Legend, Expand,  watchUtils, promiseUtils]) => {
        // create a new instance of timeslider
        let timeSlider = new TimeSlider({
            container: timeSliderRef,
            view: view,
            fullTimeExtent: {
            start: new Date(2018, 0, 1),
            end: new Date(2018, 11, 1)
            },
            playRate: 2000,
            stops: {
            interval: {
                value: 1,
                unit: "months"
                }
            }
        });

        const layers = definitions.map(function(definition){
            return [new FeatureLayer()];
          });

        // get layerviews of each fire layers once the layers are loaded
        const layerViewsEachAlways = function getLayerViews () {
            return promiseUtils.eachAlways(layers.map(function(layer: typeof FeatureLayer){
                
             return view.whenLayerView(layer);
            }));
          }
        // update the fire stats between 2014 - 2018 once timeExtent of
          // the timeSlider changes
          timeSlider.watch("timeExtent", function(){
            //updateFiresStats();
          });
          
          // query five layerviews representing fires between 2014-2018
        // this will be called from the UudateFiresStats function
        const queryFeaturesForStats = function getQueryResults (layerViewsResults: typeof FeatureLayer[] ) {
            return promiseUtils.eachAlways(layerViewsResults.map(function(result){
              // If a Promise was rejected, you can check for the rejected error
              if (result.error) {
                return promiseUtils.resolve(result.error);
              }
              // The results of the Promise are returned in the value property
              else {
                const layerView = result.value;
  
                // set the timeExtent for the stats query object. But
                // we need to offset the timeExtent for each layer by
                // number of years specified in the layer.timeOffset
                let start = new Date(timeSlider.timeExtent.start);
                let end = new Date(timeSlider.timeExtent.end);
                start.setFullYear(start.getFullYear() - layerView.layer.timeOffset.value);
                end.setFullYear(end.getFullYear() - layerView.layer.timeOffset.value);
  
                // now we have the right timeExtent for each layer
                // set the timeExtent for the stats query
                statQuery.timeExtent = {
                  start: start,
                  end: end
                };
                // query the layerviews for the stats
                return layerView.queryFeatures(statQuery).then(
                  function(response:IFeatureSet) {
                    return response.features[0].attributes;
                  },
                  function(e:any) {
                    return promiseUtils.resolve(e);
                  }
                );
              }
            }));
          }


      });
      }
      
      


    return(
    <>
    </>);

}
