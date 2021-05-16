define(["require", "exports", "tslib", "esri/Map", "esri/views/MapView", "esri/geometry/Extent", "esri/layers/FeatureLayer", "esri/form/FormTemplate", "esri/form/elements/FieldElement"], function (require, exports, tslib_1, Map_1, MapView_1, Extent_1, FeatureLayer_1, FormTemplate_1, FieldElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = tslib_1.__importDefault(Map_1);
    MapView_1 = tslib_1.__importDefault(MapView_1);
    Extent_1 = tslib_1.__importDefault(Extent_1);
    FeatureLayer_1 = tslib_1.__importDefault(FeatureLayer_1);
    FormTemplate_1 = tslib_1.__importDefault(FormTemplate_1);
    FieldElement_1 = tslib_1.__importDefault(FieldElement_1);
    var map = new Map_1.default({
        basemap: "streets-vector"
    });
    var bound = new Extent_1.default({
        "xmin": -9279203,
        "ymin": 4018851,
        "xmax": -9279173,
        "ymax": 4018999,
        "spatialReference": { "wkid": 3785 }
    });
    var view = new MapView_1.default({
        map: map,
        container: "viewDiv",
        extent: bound,
        zoom: 12
    });
    var inspectionLayer = new FeatureLayer_1.default({
        url: "https://gis1imcloud1.amec.com:6443/arcgis/rest/services/6466/LD_Athens/FeatureServer/0",
        id: "inspection",
        outFields: ["*"],
        formTemplate: new FormTemplate_1.default({
            title: "Title",
            description: "description",
            elements: [
                new FieldElement_1.default({
                    type: "field",
                    fieldName: "OBJeCTID",
                    label: "OBJECTID",
                    visibilityExpression: "alwaysHidden"
                }),
                new FieldElement_1.default({
                    type: "field",
                    fieldName: "ID",
                    label: "ID",
                }),
                new FieldElement_1.default({
                    type: "field",
                    fieldName: "Name",
                    label: "Name",
                }),
                new FieldElement_1.default({
                    type: "field",
                    fieldName: "Date_LastEdited",
                    label: " Date LastEdited"
                })
            ]
        })
    });
    // set columns used to generate grid
    var roomsLayer = {
        layer: new FeatureLayer_1.default({
            url: "https://gis1imcloud1.amec.com:6443/arcgis/rest/services/6466/LD_Athens/FeatureServer/6",
            id: "rooms",
            outFields: ["*"],
        }),
        // set columns used to generate grid
        columns: {
            "OBJECTID": "ObjectID",
            "Building": "Building",
            "Number": "Number",
            "Visited_State": "Visited_State"
        }
    };
});
//# sourceMappingURL=main.js.map