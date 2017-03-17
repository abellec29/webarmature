var center = [45.7604276, 4.8335709];

var map1 = L.map('map1', {
    center: center,
    zoom: 16,
    maxZoom: 18,
    minZoom: 13
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
).addTo(map1);

map1.zoomControl.setPosition('topright');

var sidebar = L.control.sidebar('sidebar').addTo(map1);

$("input[type=radio]").on('switchChange.bootstrapSwitch', function (e, s) {

    if(this.checked){
        removeAllLayers();
        var layerName = this.value;
        var attribution = this.alt;
        if(layerName != "LOSM"){
            var layer = L.tileLayer.wms('http://a.map.webarmature.fr/geoserver/wms/', {
                layers: layerName,
                transparent: true,
                attribution: attribution
            });
            map1.addLayer(layer);
        }
        else{
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }
            ).addTo(map1);
        }

        var groupId = $(this).closest("div[id]").attr("id");

        if(groupId == "landsatGroup" || groupId == "spotGroup"){
            map1.setZoom(13);
        }
        else{
            map1.setZoom(16);
        }
    }
});

$(".bs").bootstrapSwitch('state', false);

function removeAllLayers() {
    map1.eachLayer(function(layer) {
        map1.removeLayer(layer);
    });
}

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