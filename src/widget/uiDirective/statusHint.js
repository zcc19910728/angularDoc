/**
 * 使用范例:
 *
 *     @example
 *     <span status-hint type="c-green" >完成</span>
 *
 * 样式展现：
 * {@img statushint.jpg alt text}
 * @class statusHintModule
 */
angular.module('statusHintModule', [])
    .directive('statusHint',
    /**
     * @member statusHintModule
     * @method statusHint 标签指令，EA模式
     * @param {String} type 有四个值：c-red, c-blue, c-grey, c-green
     */

    function () {
        return {
            restrict: 'AE',
            template: '<span class="{{type}}"></span><span ng-transclude></span>',
            // replace: true,
            transclude: true,
            scope: {
                type: '@'
            }
        };
    });