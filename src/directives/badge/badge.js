/**
 * 使用范例:
 *
 *     @example
 *     <span badge type="large" cor="c-red">99+</span>
 *
 * 样式展现：
 * {@img badge.jpg alt text}
 * @class badgeModule
 */
angular.module('badgeModule', [])
    .directive('badge',
        /**
         * @member badgeModule
         * @method badge 标签指令，EA模式
         * @param {String} type = 'large' 样式大小(两个值)：large, auto
         * @param {String} cor 背景色(两个值)：c-red, c-grey
         */
        function () {
            return {
                restrict: 'AE',
                template: '<span ng-if="type === \'auto\'" style="width: auto;padding: 0 4px" class="{{colorRed}}" ng-transclude></span><span ng-if="type === \'large\'" class="{{colorRed}}" ng-transclude></span>',
                //templateUrl:'/static/js/widget/uiDirective/uiDirectiveTmp/badge.html',
                //replace: true,
                transclude: true,
                scope: {
                    type: '@',
                    cor: '@'
                },
                controller:function($scope){
                    if($scope.cor === 'c-red'){
                        $scope.colorRed = 'cell-num-wrap-red';
                    }
                    if($scope.cor === 'c-grey'){
                        $scope.colorRed = 'cell-num-wrap-grey';
                    }

                    if(!$scope.type){
                        $scope.type = 'large';
                    }
                }
            };
        });