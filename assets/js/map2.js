//Define the center of the map
var center = [45.7604276, 4.8335709];

//Create left map
var map1 = L.map('map1', {
    center: center,
    zoom: 16,
    maxZoom: 18,
    minZoom: 13
});

//Create right map
var map2 = L.map('map2', {
    center: center,
    zoom: 16,
    maxZoom: 18,
    minZoom: 13
});

//SetZoomPosition
map1.zoomControl.setPosition('topright');
map2.zoomControl.setPosition('topright');

//Sync zoom of the 2 maps
map1.sync(map2, {syncCursor: true});
map2.sync(map1, {syncCursor: true});

//Add the sidebar to the maps
L.control.sidebar('sidebar').addTo(map1);
L.control.sidebar('sidebar_right').addTo(map1);

//Set default map
var OSM = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
);

var ROSM = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
);

map1.addLayer(OSM);
map2.addLayer(ROSM);

//Upon change of map selection
$("input[type=radio]").on('switchChange.bootstrapSwitch', function (e, s) {

    //Create the new layer
    var layerName = this.value;
    var attribution = this.alt;
    var layer = L.tileLayer.wms('http://a.map.webarmature.fr/geoserver/wms/', {
        layers: layerName,
        transparent: true,
        attribution: attribution
    });

    if(this.checked){

        //If checking left group
        if (this.name == "GroupedSwitchesL") {
            removeAllMap1Layers();
            //Every map has the same structure except the default one. Make sure you don't have the default one selected
            if (layerName != "LOSM") {
                map1.addLayer(layer);
            }
            else {
                map1.addLayer(OSM);
            }

            var groupId = $(this).closest("div[id]").attr("id");

            if(groupId == "landsatGroup" || groupId == "spotGroup"){
                map1.setZoom(13);
            }
            else{
                map1.setZoom(16);
            }

        }
        //If checking right group
        else if(this.name == "GroupedSwitchesR"){
            removeAllMap2Layers();
            if (layerName != "ROSM") {
                map2.addLayer(layer);
            }
            else {
                map2.addLayer(ROSM);
            }

            var groupId = $(this).closest("div[id]").attr("id");

            if(groupId == "landsatGroup" || groupId == "spotGroup"){
                map2.setZoom(13);
            }
            else{
                map2.setZoom(16);
            }

        }

        map1.sync(map2, {syncCursor: true});
        map2.sync(map1, {syncCursor: true});
    }
});

$(".bs").bootstrapSwitch('state', false);

function removeAllMap1Layers() {
    map1.eachLayer(function (layer) {
        map1.removeLayer(layer);
    });
}

function removeAllMap2Layers() {
    map2.eachLayer(function (layer) {
        map2.removeLayer(layer);
    });
}

L.popup();

//Collapse and put inactive the selected element of the other sidebar on click
$("#sidebar_right").click(function(){
   $("#sidebar").addClass("collapsed");
   $("#sidebar-elements").find("li").each(function(){
        $(this).removeClass("active");
   });
});

$("#sidebar").click(function(){
    $("#sidebar_right").addClass("collapsed");
    $("#sidebar_right-elements").find("li").each(function(){
        $(this).removeClass("active");
    });
});

$(".sidebarButton").click(function(){
    if(!($(this).hasClass("selected"))){
        $(".sidebarButton").each(function(){
            $(this).removeClass("selected");
        });
        $(this).addClass("selected");
    }
    else{
        $(this).removeClass("selected");
    }
});