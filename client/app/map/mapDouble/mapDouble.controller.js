'use strict';

import angular from 'angular';

export default class MapDoubleController {

  /*@ngInject*/
  constructor($scope) {
    $scope.groupLeftName = "leftGroup";
    $scope.groupRightName = "rightGroup";
    $scope.sidebar1 = "sidebarLeft";
    $scope.sidebar2 = "sidebarRight";

    $scope.maps = [];
  }

  $onInit() {

  }

}
