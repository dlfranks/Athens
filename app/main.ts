import EsriMap from "esri/Map";
import MapView from "esri/views/MapView";
import Extent from "esri/geometry/Extent";
import FeatureLayer from 'esri/layers/FeatureLayer';
import Element from "esri/form/elements/Element";
import FormTemplate from 'esri/form/FormTemplate';
import FieldElement from 'esri/form/elements/FieldElement';



var inspectionLayer = new FeatureLayer({
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
  

var roomsLayer = new FeatureLayer({
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
  container: "viewDiv",
  extent: bound,
  zoom: 18
});

map.add(inspectionLayer);
map.add(roomsLayer);


