'use strict';
const angular = require('angular');

export default angular.module('webarmatureApp.sidebar', [])
  .directive('sidebar', function () {

    function link(scope, element, attrs) {

      let defaultMapConfig = {
        center: [45.7604276, 4.8335709],
        zoom: 16,
        maxZoom: 18,
        minZoom: 13
      };

      let mapId = $(element).parent().attr("id");
      let sidebarId = element.attr("id");
      let sidebarGroupName = scope.groupName;

      let map = L.map(mapId, defaultMapConfig);

      scope.maps.push(map);

      syncMaps();

      map.zoomControl.setPosition('topright');

      L.control.sidebar(sidebarId).addTo(map);

      let OSM = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      });

      map.addLayer(OSM);

      $("input[type=radio]").on('switchChange.bootstrapSwitch', function (e, s) {

        if(this.checked){
          //Create the new layer
          let layerName = this.value;
          let attribution = this.alt;
          let groupId = $(this).closest("div[id]").attr("id");
          let layer = L.tileLayer.wms('http://a.map.webarmature.fr/geoserver/wms/', {
            layers: layerName,
            transparent: true,
            attribution: attribution
          });

          if(this.name == sidebarGroupName) {
            removeAllMapLayers(map);
            if (layerName != "OSM") {
              map.addLayer(layer);
            }
            else {
              map.addLayer(OSM);
            }
          }

          if(groupId == "landsatGroup" || groupId == "spotGroup"){
            map.setZoom(13);
          }

          syncMaps();
        }
      });

      $(".bs").bootstrapSwitch('state', false);

      function removeAllMapLayers(map) {
        map.eachLayer(function (layer) {
          map.removeLayer(layer);
        });
      }

      function syncMaps(){
        for(let i=0; i < scope.maps.length -1; i++){
          let firstMap = scope.maps[i];
          let secondMap = scope.maps[i+1];
          firstMap.sync(secondMap, {syncCursor: true});
          secondMap.sync(firstMap, {syncCursor: true});
        }
      }

      $("#mapsArea").click(function (event) {
        if (!$(event.target).closest("#"+sidebarId).length) {
          if (!($("#"+sidebarId).hasClass("collapsed"))) {
            $("#"+sidebarId).addClass("collapsed");
            $("#"+sidebarId).find("li").each(function () {
              $(this).removeClass("active");
            });
            $().addClass("collapsed");
          }
        }
      });

      scope.addSelected = function(event){

        if (!(angular.element(event.target).hasClass("selected"))) {
          $(".sidebarButton").each(function () {
            $(this).removeClass("selected");
          });
          angular.element(event.target).addClass("selected");
        }
        else {
          angular.element(event.target).removeClass("selected");
        }

      };

      scope.startTour = function(){
        let tour = new Tour({
          name: "mapTour",
          storage: false,
          backdrop: false,
          steps: [
            {
              element: "#howTab",
              title: "Aide",
              content: "Ceci est l'onglet pour l'aide. Pour avoir plus d'informations sur le fonctionnement des différentes sections, consultez cet onglet.",
              onShow: function(){
                if(!($("#how").hasClass("active"))){
                  $("#howTab")[0].click();
                }
              }
            },
            {
              element: "#mapTab",
              title: "Maps",
              content: "Ceci est la vue pour les différentes cartes. Dans cet onglet vous pouvez choisir quelles cartes seront affichées.",
              onShow: function(){
                if(!($("#mapPane").hasClass("active"))){
                  $("#mapTab")[0].click();                }
              }
            },
            {
              element: ".sidebarButton:first",
              title: "Catégorie",
              content: "Choississez la catégorie que vous souhaitez visionner.",
              onShow: function(){
                $(".sidebarButton:first").click();
              }
            },
            {
              element: "input[type=radio]:eq(1)",
              title: "Sélection de carte",
              content: "Puis sélectionnez la carte que vous souhaitez visionner.",
              smartplacement: false,
              placement: "bottom",
              onShow: function(){
                $("input[type=radio]:eq(1)").bootstrapSwitch('state', true);
              },
              onNext: function () {
                $("#mapsArea").click();
              }
            },
            {
              element: ".leaflet-control-zoom",
              title: "Zoom",
              content: "Ceci est le zoom. Vous pouvez cliquez cet élément pour agrandir ou rétrécir la carte.",
              smartplacement: false,
              placement: "left"
            },
            {
              element: ".leaflet-control-attribution",
              title: "Source",
              content: "Ceci est la source pour chacune des cartes. Nous remercions nos partenaires.",
              smartplacement: false,
              placement: "top"
            },
            {
              element: "#navbarCollapse",
              title: "Apprenez en plus",
              content: "Choississez les autres onglets pour en apprendre plus sur le projet!",
              smartplacement: false,
              placement: "bottom"
            }
          ]
        }).init().start();
      };

    }

    return {
      restrict: 'E',
      scope: {
        maps: '=',
        groupName: '='
      },
      template: require('./sidebar.html'),
      link: link
    }
  })
  .name;