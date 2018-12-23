/**
 * 使用范例:
 *
 *     @example
 *     <span icon-title icon="&#xe636;" cor="cor-blue">订单</span>
 *
 * 样式展现：
 * {@img icontitle.jpg alt text}
 * @class iconTitleModule
 */
angular.module('iconTitleModule', [])
    .directive('iconTitle',
    /**
     * @member iconTitleModule
     * @method iconTitle 标签指令，EA模式
     * @param {String} icon 所需icon值
     * @param {String} cor  字体颜色-自定义class
     */
    function () {
        return {
            restrict: 'AE',
            template: '<h3 class="fw-b d-ib" style="font-size: 14px;line-height: 30px">'+
            '<span style="font-size: 18px;font-weight: initial;vertical-align: middle" class="iconfont mr-10 {{cor}}" ng-bind-html="icon"></span>'+
            '<span class="va-m" ng-transclude></span>'+
            '</h3>',
            //replace: true,
            transclude: true,
            scope: {
                icon: '@',
                cor: '@'
            },
            controller:function($scope){
                if(!$scope.cor){
                    $scope.cor = 'cor-blue';
                }
            }
        };
    });
