/**
 * Created by 大漠 on 16/5/10.
 * Modified by Beile on 17/5/31. add sort param
 * Modified by Beile on 18/4/15. add fixed header
 */



(function(){
    'use strict';

    // https://github.com/KyleAMathews/element-resize-event
    var resizeListener = (function() {
        var requestFrame = (function() {
            var raf = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function fallbackRAF(func) {
                    return window.setTimeout(func, 20);
                };
            return function requestFrameFunction(func) {
                return raf(func);
            };
        })();

        var cancelFrame = (function() {
            var cancel = window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.clearTimeout;
            return function cancelFrameFunction(id) {
                return cancel(id);
            };
        })();

        function resizeListener(e) {
            var win = e.target || e.srcElement;
            if (win.__resizeRAF__) {
                cancelFrame(win.__resizeRAF__);
            }
            win.__resizeRAF__ = requestFrame(function() {
                var trigger = win.__resizeTrigger__;
                if (!trigger) return;
                trigger.__resizeListeners__.forEach(function(fn) {
                    fn.call(trigger, e);
                });
            });
        }

        var theExports = function theExports(element, fn) {
            var document = window.document;

            function objectLoad() {
                this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
                this.contentDocument.defaultView.addEventListener('resize', resizeListener);
            }

            if (!element.__resizeListeners__) {
                element.__resizeListeners__ = [];
                if (getComputedStyle(element).position === 'static') {
                    element.style.position = 'relative';
                }
                var obj = (element.__resizeTrigger__ = document.createElement('object'));
                obj.setAttribute(
                    'style',
                    'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; opacity: 0;'
                );
                obj.setAttribute('class', 'resize-sensor');
                obj.__resizeElement__ = element;
                obj.onload = objectLoad;
                obj.type = 'text/html';
                obj.data = 'about:blank';
                element.appendChild(obj);
            }
            element.__resizeListeners__.push(fn);
        };

        var finalExport = theExports.bind(window);

        finalExport.unbind = function(element, fn) {
            if (!element.__resizeListeners__) return;
            if (fn) {
                element.__resizeListeners__.splice(
                    element.__resizeListeners__.indexOf(fn),
                    1
                );
            } else {
                element.__resizeListeners__ = [];
            }
            if (!element.__resizeListeners__.length) {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener(
                    'resize',
                    resizeListener
                );
                delete element.__resizeTrigger__.contentDocument.defaultView.__resizeTrigger__;
                element.__resizeTrigger__ = !element.removeChild(
                    element.__resizeTrigger__
                );
                delete element.__resizeListeners__;
            }
        };


        return finalExport;
    })();


    angular.module('grid',['hipacPage','ngSanitize']).provider('gridConfig', function() {
        this.options = {
            method              : 'POST',
            url                 : '',
            loadSuccessCallback : function(){},
            pageSuccessCallback : function(){},
            rowToggleSelectCallback : function(){},
            rowAllToggleSelectCallback : function(){},
            errorCallback : function(){},
            renderCallback : null, // 表单渲染后执行回调
            paginationPageSizes : [10, 25, 50],
            paginationPageSize  : 10,
            paginationCurrentPage : 1,
            total               : 1,
            params              : {},
            data                : [],
            selectData          : [],  // 选中对象
            selectAll           : false,  //是否显实全选
            showPage            : true,  //是否显示分页
            fixedHeader         : false,  // 是否固定表头
            fixedHeaderTop      : 53,  // 固定表头时顶部高度
            nullDataText        : '暂无数据',    //无数据时自定义展示文案
            domainType: null,
        };
        this.$get = function() {
            var options = this.options;

            return {
                getOptions: function() {
                    return angular.extend({},options);
                }
            };
        };

        this.setOptions = function(options) {
            angular.extend(this.options, options);
        };
    }).filter('trustHtml', ['$sce',function ($sce) {//转义html
        return function (input) {
            return $sce.trustAsHtml(input);
        };
    }]).run(['$templateCache',function($templateCache) {
        $templateCache.put('gridTemplate.html',
            `
<div class="jtable-wrap" ng-class="{'is-fixed-header': orderGridOptions.fixedHeader}">
    <table class="fake-table" ng-if="orderGridOptions.fixedHeader">
        <thead>
            <tr class="fake-header">
                <th class="fake-header-item" ng-if="orderGridOptions.selectAll">
                    <input type="checkbox" ng-model="$parent.gridSelectAll" ng-change="selectAll()" ng-disabled="!orderGridOptions.data.length">
                </th>
                <th class="fake-header-item" ng-if="tabHeaderItem" width="{{tabHeaderItem.width}}" ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index" bindonce>
                    <span ng-bind-html="tabHeaderItem.displayName"></span>
                    <span ng-if="tabHeaderItem.sort" class="iconfont cur-p sortShow" ng-init="tabHeaderItem.sortData = tabHeaderItem.sort; tabHeaderItem.sortActive= '' " ng-click="changeOrder(tabHeaderItem)">
                        <span ng-if="tabHeaderItem.sortData == 'desc'" ng-class="{'cor-red': tabHeaderItem.sortActive == 'desc'}">&#xe615;</span>
                        <span ng-if="tabHeaderItem.sortData == 'asc'" ng-class="{'cor-red': tabHeaderItem.sortActive == 'asc'}">&#xe666;</span>
                    </span>
                </th>
            </tr>
        </thead>
    </table>

    <table class="table-item table-item-main" width="100%">
        <thead>
            <tr>
                <th ng-if="orderGridOptions.selectAll">
                    <input type="checkbox" ng-model="$parent.gridSelectAll" ng-change="selectAll()" ng-disabled="!orderGridOptions.data.length"></th>
                <th ng-if="tabHeaderItem" width="{{tabHeaderItem.width}}" ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index" bindonce>
                    <span ng-bind-html="tabHeaderItem.displayName"></span>
                    <span ng-if="tabHeaderItem.sort" class="iconfont cur-p sortShow" ng-init="tabHeaderItem.sortData = tabHeaderItem.sort; tabHeaderItem.sortActive= '' " ng-click="changeOrder(tabHeaderItem)">
                        <span ng-if="tabHeaderItem.sortData == 'desc'" ng-class="{'cor-red': tabHeaderItem.sortActive == 'desc'}">&#xe615;</span>
                        <span ng-if="tabHeaderItem.sortData == 'asc'" ng-class="{'cor-red': tabHeaderItem.sortActive == 'asc'}">&#xe666;</span>
                    </span>
                </th>
            </tr>
        </thead>
        <tbody grid-row="tabItem" row-index="$index" ng-repeat="tabItem in orderGridOptions.data track by tabItem.id" bindonce>
            <tr>
                <td ng-if="orderGridOptions.selectAll">
                    <input type="checkbox" ng-model="tabItem.gridSelectItem" ng-change="selectItem(tabItem,$index)"></td>
                <td ng-if="tabHeaderItem" ng-class="tabHeaderItem.class" ng-repeat="tabHeaderItem in orderGridOptions.columnDefs track by $index" bindonce  grid-cell="{{$index}}">{{tabItem[tabHeaderItem.field]}}</td>
            </tr>
        </tbody>
        <tbody ng-if="orderGridOptions.data.length == 0">
            <tr>

                <td colspan="{{orderGridOptions.selectAll? (orderGridOptions.columnDefs.length + 1): orderGridOptions.columnDefs.length}}" ng-bind-html="orderGridOptions.nullDataText |trustHtml"></td>
            </tr>
        </tbody>
    </table>
    <div class="paging" ng-if="orderGridOptions.showPage" hipac-page page="orderGridOptions.paginationCurrentPage" page-size="orderGridOptions.paginationPageSize" total="orderGridOptions.total" paging-action="foo(page,pageSize, total)"></div>
</div>
            `);
    }]).factory('girdFactory',['$http','$rootScope','$timeout','gridConfig',function($http,$rootScope,$timeout,gridConfig){
        var opt = {};
        var time;

        function init(o,callback){
            var conf = gridConfig.getOptions();
            angular.extend(conf,o);   //转换默认
            opt = angular.extend(o,conf);    //默认转换成传过来的配置

            getData(function(data){ //请求数据
                opt.loadSuccessCallback(data);
                if(callback){
                    callback(opt);
                }
            });
        }

        function getData(callback,getData){
            $timeout.cancel(time);
            time = $timeout(function(){
                if(opt.url){   //如果默认有数据，callback回调
                    var getDataOpt = {
                        method     :  opt.method,
                        url        :  opt.url,
                        dataType   :  'json',
                        domainType : opt.domainType,
                    };

                    var getParams = {
                        pageNo : opt.paginationCurrentPage,
                        pageSize : opt.paginationPageSize
                    };

                    angular.extend(getParams,getData || {},opt.params);

                    if(opt.method.toUpperCase() == 'POST'){  //判断是post还是get
                        getDataOpt.data = getParams;
                    }else{
                        getDataOpt.params = getParams;
                    }

                    $http(getDataOpt).success(function(datas){    //请求数据
                        opt.data = datas.data;
                        opt.total = datas.totalCount;

                        opt.paginationCurrentPage = getParams.pageNo;

                        if(callback){
                            callback(datas);
                        }
                    }).error(function(){
                        opt.errorCallback.apply(this, arguments);
                    });
                }
            },0);
        }

        return {
            init        :  init,
            getData     : getData
        };
    }]).controller('gridCtrl',['$scope','$rootScope','girdFactory',function($scope,$rootScope,girdFactory){
        this.gridScope = $scope;  //提供方法出去被调用

        // table fixed header
        function getRootById(id) {
            let element;
            $('.jtable-wrap').each(function(i, e){
                var s = $(e).scope();
                if(s && s.$id === id){
                    element = e;
                    return false;
                }
            });
            return element;
        }

        var lastWidths = [];

        var scrollFixedHeader = function(){
            var rootElem = getRootById($scope.$id);
            if (!rootElem) return false;
            var fakeTable = $(rootElem).find('.fake-table');

            var bounding = rootElem.getBoundingClientRect();
            var width = bounding.right - bounding.left;
            if (bounding.top < $scope.orderGridOptions.fixedHeaderTop) {
                fakeTable.css({
                    display: 'table',
                    top: $scope.orderGridOptions.fixedHeaderTop + 'px',
                    width: width + 'px',
                    left: bounding.left + 'px',
                });
            } else {
                fakeTable.css({ display: 'none' });
                return;
            }

            var widths = $.map($(rootElem).find('table:not(.fake-table) thead th'), function(e) {
                var bounding = e.getBoundingClientRect();
                return bounding.right - bounding.left;
            });
            var lastVisibleHeaderIndex = widths.length - 1;
            for (let i = 0; i < widths.length;i += 1) {
                if(widths[i]) {
                    lastVisibleHeaderIndex = i;
                }
            }
            widths[lastVisibleHeaderIndex] = widths[lastVisibleHeaderIndex] - 1;
            var headerItems = $(rootElem).find('.fake-header > .fake-header-item');

            headerItems.each(function (i, e){
                var item = $(e);
                if (widths[i] === 0) {
                    item.css({ display: 'none' });
                    return;
                } else {
                    item.css({ display: '' });
                }
                if (lastWidths[i] !== widths[i]) {
                    item.attr('width', widths[i]);
                }
            });
            lastWidths = widths;
            return rootElem;
        };
        this.$onInit = function() {
            var checkInterval = setInterval(() => {
                var rootElem = getRootById($scope.$id);
                if (rootElem) {
                    setTimeout(() => {
                        if ($scope.orderGridOptions.fixedHeader) {
                            resizeListener(rootElem, scrollFixedHeader);
                            scrollFixedHeader();
                            $(window).on('scroll', scrollFixedHeader);
                        }
                    }, 0);

                    clearInterval(checkInterval);
                }
            }, 100);
        };

        this.$onDestroy = function() {
            if (!$scope.orderGridOptions.fixedHeader) return;
            var rootElem = getRootById($scope.$id);
            if (rootElem) {
                resizeListener.unbind(rootElem);
            }
            $(window).unbind('scroll', scrollFixedHeader);
        };

        function initSelectData() {
            $scope.orderGridOptions.selectData = [];
            $scope.gridSelectAll = false;
        }

        $scope.foo = function(){
            initSelectData();
            girdFactory.getData($scope.orderGridOptions.pageSuccessCallback);
        };

        $scope.orderGridOptions.refresh = $scope.orderGridOptions.search = function(page){
            initSelectData();
            $scope.orderGridOptions.paginationCurrentPage = page || 1;
            // girdFactory.getData.apply(this,arguments);
            girdFactory.getData.apply(this, [$scope.orderGridOptions.loadSuccessCallback]);
        };

        $scope.selectItem = function(row,index){
            var selectNum = 0;
            angular.addEditJson({
                data : $scope.orderGridOptions.selectData,
                item : row,
                name : 'id',
                forSelectCallback : function(row){
                    selectNum++;
                    if(selectNum == $scope.orderGridOptions.data.length){
                        $scope.gridSelectAll = true;
                    }else{
                        $scope.gridSelectAll = false;
                    }
                }
            });
            $scope.orderGridOptions.rowToggleSelectCallback(row,index);
        };

        $scope.selectAll = function(){
            angular.addEditJson({
                data : $scope.orderGridOptions.selectData,
                item : $scope.orderGridOptions.data,
                name : 'id',
                selectAll : $scope.gridSelectAll,
                selectCallback : function(row){
                    row.gridSelectItem = true;
                },
                removeCallback : function (row) {
                    row.gridSelectItem = false;
                }
            });
            $scope.orderGridOptions.rowAllToggleSelectCallback($scope.gridSelectAll);
        };

        // 排序
        $scope.changeOrder = function(data){

            // 当前标红排序样式清除
            $('.table-item').find('.sortShow').find('.cor-red').removeClass('cor-red');

            if (data.sortData === 'desc') {
                data.sortData = 'asc';
                data.sortActive = 'asc';
            } else {
                data.sortData = 'desc';
                data.sortActive = 'desc';
            }

            // 页面刷新
            initSelectData();

            // 用于传入初始化后，额外添加的搜索参数
            if (typeof $scope.orderGridOptions.pageSuccessCallback === 'function') {
                $scope.orderGridOptions.pageSuccessCallback();
            }

            if (data.field && data.sortData) {
                angular.extend($scope.orderGridOptions.params, {
                    orderByField: data.field + ',' + data.sortData,
                });
            }

            $scope.orderGridOptions.refresh();
        };

        $scope.orderGridOptions.renderCallback && $scope.orderGridOptions.renderCallback();

    }]).directive('grid',['$compile','girdFactory',function($compile,girdFactory){
        return {
            restrict: 'AE',
            templateUrl: 'gridTemplate.html',
            scope: {
                orderGridOptions: '=grid'
            },
            controller: 'gridCtrl',
            link: function(scope, elm, attrs) {
                setTimeout(function(){
                    girdFactory.init(scope.orderGridOptions);
                },0);
            }
        };
    }]).directive('gridRow',['$compile','$timeout',function($compile,$timeout){
        return {
            restrict: 'AE',
            require: '^grid',
            scope: {
                row: '=gridRow',
                $index: '=rowIndex'
            },
            controller: ['$scope', function ($scope) {
                this.gridRow = $scope;
            }],
            link: function($scope, $elm, $attrs,gridCtr) {
                $scope.evt = {
                    entity : gridCtr.gridScope.$parent
                };
            }
        };
    }]).directive('gridCell',['$compile','$timeout',function($compile,$timeout){
        return {
            restrict: 'AE',
            require: ['^grid','^gridRow'],
            scope: {
                gridCellIndex : '@gridCell'
            },
            compile: function() {
                return {
                    pre: function(scope, elm, $attrs, controllers) {
                        var itemColumnDefs = controllers[0].gridScope.orderGridOptions.columnDefs[scope.gridCellIndex];
                        var rowCrt = controllers[1].gridRow;
                        var cell = itemColumnDefs.cellTemplate;

                        function compile(html,commpileScope){
                            if(html){
                                $compile(html)(commpileScope, function(cloned, scope){
                                    elm.html('').append(cloned);
                                });
                            }else{
                                elm.html('<div></div>');
                            }
                        }

                        if(itemColumnDefs.filter) {   //过滤器存在,优先过滤器
                            var template = itemColumnDefs.filter(rowCrt.row);
                            compile(template, rowCrt);
                            return;
                        }

                        if (cell) {   //自定义拼接模版,优先,最后在去匹配
                            compile(cell,rowCrt);
                        }
                    }
                };
            }
        };
    }]);
}());
