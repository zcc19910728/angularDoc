/**
 * 使用范例:
 *
 *     @example
 *     <span square-title type="large" cor="#7b7de5">巨划算</span>
 *
 * 样式展现：
 * {@img squaretitle.jpg alt text}
 * @class squareTitleModule
 */
angular.module('squareTitleModule', [])
    .directive('squareTitle',
    /**
     * @member squareTitleModule
     * @method squareTitle 标签指令，EA模式
     * @param {String} type = 'large' 样式大小(三个值)：large, middle, min
     * @param {String} cor ='#7b7de5' 背景色：自定义
     */
    function () {
        return {
            restrict: 'AE',
            template: '<h2 ng-if="type === \'large\'" style="font-size: 18px;line-height: 18px;" class="d-ib"><span class="title-aside" style="background-color: {{cor}}; height: 18px;"></span><span ng-transclude></span></h2>'+
            '<h2 ng-if="type === \'middle\'" style="font-size: 15px;line-height: 15px;" class="d-ib"><span class="title-aside" style="background-color: {{cor}}; height: 15px;"></span><span ng-transclude></span></h2>'+
            '<h2 ng-if="type === \'min\'" style="font-size: 12px;line-height: 12px;" class="d-ib"><span class="title-aside" style="background-color: {{cor}}; height: 12px;"></span><span ng-transclude></span></h2>',
            //replace: true,
            transclude: true,
            scope: {
                type: '@',
                cor: '@'
            },
            controller:function($scope){
                if(!$scope.type){
                    $scope.type = 'large';
                }
                if(!$scope.cor){
                    $scope.cor = '#7b7de5';
                }
            }
        };
    });