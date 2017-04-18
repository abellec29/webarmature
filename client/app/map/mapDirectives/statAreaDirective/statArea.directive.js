'use strict';
const angular = require('angular');
const d3 = require('d3');

export default angular.module('webarmatureApp.statArea', [])
  .directive('statArea', function () {

    return {
      restrict: 'EA',
      transclude: true,
      template: require('./statArea.html'),
      controller: 'statAreaController'
    }
  })
  .controller('statAreaController', ['$scope', function ($scope) {

    $scope.printChart = function(dataset){

      //remove svg to draw new chart
      d3.select("#" + $scope.chartId + " g").remove();

      var height = $("stat-area").height() *0.9;
      var width = $("stat-area").width();
      var radius = Math.min(width, height) / 2;
      var margin = {top: 40, bottom: 45};

      var color = d3.scaleOrdinal()
        .range(["#006a01", "#00b515" , "#e2d920", "#f85402", "#a40005"]);

      var svg = d3.select('#' + $scope.chartId)
        .attr('width', width)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + (width/2-75) +  ',' + ((height / 2)+margin.top/2) + ')');

      var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      var pie = d3.pie()
        .value(function(d) { return d.count; })
        .sort(null);

      var path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
          return color(d.data.label);
        });

      var legendRectSize = 18;
      var legendSpacing = 4;

      var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i){
          var height = legendRectSize + legendSpacing;
          var offset =  height * (color.domain().length+1) / 2;
          var horz = $("stat-area").height()/2 + 10;
          var vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
        });

      legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke-width', "1px")
        .style('stroke', "black");

      legend.append('text')
        .data(dataset)
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .style("font-weight", "bold")
        .text(function(d, i) {
          return i*20 + "-" + (i*20 + 20) + "%: ";
        });

      legend.append('text')
        .data(dataset)
        .attr('x', legendRectSize + legendSpacing + 55)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d, i){
          return d.count + "%";
        });

      let legendTotal = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i){
          var height = legendRectSize + legendSpacing;
          var offset =  height * (color.domain().length+1) / 2;
          var horz = $("stat-area").height()/2 + 10;
          var vert = 5 * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
        });

      legendTotal.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', "white")
        .style('stroke-width', "1px")
        .style('stroke', "black");
      legendTotal.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .style("font-weight", "bold")
        .text("% total: ");
      legendTotal.append('text')
        .attr('x', legendRectSize + legendSpacing + 55)
        .attr('y', legendRectSize - legendSpacing)
        .text($scope.dataAverage + "%");

      let title = svg.append("text")
        .text("Pourcentage d'imperméabilité")
        .attr("x", function(){
          let parentWidth = this.parentNode.getBoundingClientRect().width;
          let elementWidth = this.getBoundingClientRect().width;
          return (parentWidth - elementWidth) /2;
        })
        .attr("y", 0 - (height/2) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold");
    };

    $scope.$watch('dataset.impermeable', function(){
      if(typeof $scope.dataset.impermeable != "undefined"){
        $scope.printChart($scope.dataset.impermeable);
      }
    });

    $scope.dataset = {};

  }])
  .name;

