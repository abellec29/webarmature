'use strict';
const angular = require('angular');
const L = require('leaflet');
require('leaflet-sidebar-v2');

require('bootstrap-switch');

export default angular.module('webarmatureApp.sidebar', [])
  .directive('sidebar', function() {
    function link(scope, element) {
      //Wait for map to load properly before setting up sidebar
      setTimeout(function() {
        let sidebarId = element.attr('id');
        L.control.sidebar(sidebarId).addTo(scope.map);
      }, 0);

      //Add style to accordion button when opening them
      //And remove style from other accordion buttons
      scope.addSelected = function(event) {
        if(!angular.element(event.target).hasClass('selected')) {
          $('.sidebarButton').each(function() {
            $(this).removeClass('selected');
          });
          angular.element(event.target).addClass('selected');
        } else {
          angular.element(event.target).removeClass('selected');
        }
      };

      scope.changeTownBorders = function() {
        if(scope.showTownBorders) {
          scope.addTownBorders();
        } else {
          scope.removeTownBorders();
        }
      };

      $('input[type=radio]').on('switchChange.bootstrapSwitch', function() {
        if(this.checked) {
          //Create the new layer
          let layerName = this.value;
          let attribution = this.alt;
          let groupId = $(this).closest('div[id]')
            .attr('id');
          let itemName = this.name;

          scope.changeLayer(layerName, attribution, groupId, itemName);
        }
      });

      //Close sidebarDirective when clicking outside of it
      $('#mapsArea').click(function(event) {
        if(!$(event.target).closest(`#${scope.sidebarId}`).length) {
          if(!$(`#${scope.sidebarId}`).hasClass('collapsed')) {
            $(`#${scope.sidebarId}`).addClass('collapsed');
            $(`#${scope.sidebarId}`).find('li')
              .each(function() {
                $(this).removeClass('active');
              });
            $().addClass('collapsed');
          }
        }
      });

      //Make it possible to scroll in the sidebar
      $('sidebar').on('wheel', function(event) {
        event.stopPropagation();
      });

      scope.statTrigger = false;

      scope.toggleLegend = function(){
        $(`#${scope.chartId}legendContainer`).toggle();
      };

    }
    return {
      restrict: 'E',
      transclude: true,
      template: require('./sidebar.html'),
      link,
      controller: 'sidebarController'
    };
  })
  .controller('sidebarController', ['$scope', '$timeout', function($scope, $timeout) {
    //Dirty hack to make bootstrap switch work if there is more than one use of the directive on the page
    $timeout(function() {
      $('.bs').bootstrapSwitch('state', false);
    }, 0);
  }])
  .name;
