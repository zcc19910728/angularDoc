/**
 * 使用范例:
 *
 *     @example
 *     <span prompt icon="&#xe66d;">只能选择出售中的商品、每个商品只能选择1个规格，每个巨划算最多选择200个商品</span>
 *
 * 样式展现：
 * {@img prompt.jpg alt text}
 * @class promptModule
 */
angular.module('promptModule', [])
    .directive('prompt',
    /**
     * @member promptModule
     * @method prompt 标签指令，EA模式
     * @param {String} icon 所需icon值
     */
    function () {
        return {
            restrict: 'AE',
            template: '<div class="height-36 bg-o">'+
            '<span class="iconfont cur-p hint" style="margin-left:16px; color:#FFBF00;font-size: 14px; vertical-align: bottom;">{{icon}}</span>'+
            '<span class="d-ib ml-10" style="color: #444" ng-transclude></span>'+
            '</div>',
            //replace: true,
            transclude: true,
            scope: {
                icon: '@',
                cor: '@'
            }
        };
    });