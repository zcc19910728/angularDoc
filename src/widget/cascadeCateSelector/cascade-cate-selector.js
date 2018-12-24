angular.module('cascade-cate-selector', ['__cascadeCateSelectorTemplates__']).provider('cascadeCateSelectorConfig', function() {

    // 是否展示 2,3,4 级下拉选项，默认逐级展示
    this.options = {
        selectShowLv2: true,
        selectShowLv3: true,
        selectShowLv4: true
    };

    this.$get = function() {
        var options = this.options;
        return {
            getOptions: function(params) {
                return angular.extend({}, options, params);
            }
        };
    };

    this.setOptions = function(options) {
        angular.extend(this.options, options);
    };
})
    .service('cascadeCateSelectorService', ['$http', function($http) {
        // 获取树结构
        this.listBehindCategoryTree = function(postData, callback) {
            $http({
                method: 'POST',
                cache: true,
                url: '/seller/item/category/listBehindCategoryTree.json',
                dataType: 'json',
                data: postData
            }).success(callback);
        };

        // 单独获取下一级类目
        this.showCategory = function(postData, callback) {
            $http({
                method: 'POST',
                cache: true,
                url: '/seller/item/category/showCategory.json',
                dataType: 'json',
                data: postData
            }).success(callback);
        };
    }])
    .directive('cascadeCateSelectorWithWrapper', ['$rootScope', '$cacheFactory', 'cascadeCateSelectorConfig', 'cascadeCateSelectorService', function($rootScope, $cacheFactory, cascadeCateSelectorConfig, cascadeCateSelectorService) {
        return {
            restrict: 'AE',
            templateUrl: 'cascade-cate-selector-with-wrapper.html',
            // replace: true,
            // transclude: true,
            scope: {
                cate: '='
            },
            link: function(scope, element) {

                // 获取当前选项
                var getItemData = function(arr, id) {
                    for (var i = 0; i < arr.length; i++) {
                        if (id == arr[i].id) {
                            return arr[i];
                        }
                    }
                    return {};
                };

                scope.opt = angular.extend(cascadeCateSelectorConfig.getOptions(scope.img),scope.cate);

                // 是否展示 2,3,4 级下拉选项，默认逐级展示
                // scope.selectShowLv2 = scope.cate.selectShowLv2 === undefined ? true : scope.cate.selectShowLv2;
                // scope.selectShowLv3 = scope.cate.selectShowLv3 === undefined ? true : scope.cate.selectShowLv3;
                // scope.selectShowLv4 = scope.cate.selectShowLv4 === undefined ? true : scope.cate.selectShowLv4;

                scope.categoryIdFirst = [];
                scope.categoryIdSecond = [];
                scope.categoryIdThird = [];
                scope.categoryIdFourth = [];

                scope.categoryIdFirstChange = function(item, callback) {
                    scope.categoryIdSecond = [];
                    scope.categoryIdThird = [];
                    scope.categoryIdFourth = [];

                    if (item && item.id) {

                        scope.categoryIdSecond = item.childrenCategory;

                        if (callback) {
                            // 初始化时选定
                            callback(item.childrenCategory);
                        } else {
                            scope.cate.categoryIdSecond = '';
                            scope.cate.categoryIdThird = '';
                            scope.cate.categoryIdFourth = '';

                            // 仅在非初始化时，广播当前类目信息
                            $rootScope.$broadcast('currentSelectedCateData', item);
                        }

                    }
                };

                scope.categoryIdSecondChange = function(item, callback) {
                    scope.categoryIdThird = [];
                    scope.categoryIdFourth = [];
                    if (item && item.id) {
                        scope.categoryIdThird = item.childrenCategory;

                        if (callback) {
                            callback(item.childrenCategory);
                        } else {
                            scope.cate.categoryIdThird = '';
                            scope.cate.categoryIdFourth = '';

                            $rootScope.$broadcast('currentSelectedCateData', item);
                        }
                    }
                };

                scope.categoryIdThirdChange = function(item, callback) {
                    scope.categoryIdFourth = [];
                    if (item && item.id) {
                        scope.categoryIdFourth = item.childrenCategory;

                        if (callback) {
                            callback(item.childrenCategory);
                        } else {
                            scope.cate.categoryIdFourth = '';

                            $rootScope.$broadcast('currentSelectedCateData', item);
                        }
                    }
                };

                scope.categoryIdFourthChange = function(item, callback) {
                    $rootScope.$broadcast('currentSelectedCateData', item);
                };

                scope.getLastSelectedCateData = function() {
                    // 获取最末一级当前选中数据
                    var item = {};
                    if (scope.cate.categoryIdFourth && scope.cate.categoryIdFourth.id) {
                        item = scope.cate.categoryIdFourth;
                    } else if (scope.cate.categoryIdThird && scope.cate.categoryIdThird.id) {
                        item = scope.cate.categoryIdThird;
                    } else if (scope.cate.categoryIdSecond && scope.cate.categoryIdSecond.id) {
                        item = scope.cate.categoryIdSecond;
                    } else {
                        item = scope.cate.categoryIdFirst;
                    }

                    return item;
                };

                // 删除选中
                scope.onRemove = function($event, index) {
                    $event.stopPropagation();

                    if (index === 1) {
                        scope.cate.categoryIdFirst = '';
                        scope.cate.categoryIdSecond = '';
                        scope.cate.categoryIdThird = '';
                        scope.cate.categoryIdFourth = '';
                    } else if (index === 2) {
                        scope.cate.categoryIdSecond = '';
                        scope.cate.categoryIdThird = '';
                        scope.cate.categoryIdFourth = '';
                    } else if (index === 3) {
                        scope.cate.categoryIdThird = '';
                        scope.cate.categoryIdFourth = '';
                    } else {
                        scope.cate.categoryIdFourth = '';
                    }

                    $rootScope.$broadcast('currentSelectedCateData', {
                        id: scope.getLastSelectedCateData()
                    });
                };

                // 初始化类目数据
                function setData() {
                    // init
                    cascadeCateSelectorService.listBehindCategoryTree({}, function(data) {
                        // source data
                        scope.categoryIdFirst = data.data;

                        if (scope.cate.categoryIdFirst.id) {
                            scope.cate.categoryIdFirst = getItemData(scope.categoryIdFirst, scope.cate.categoryIdFirst.id);
                        }

                        if (scope.cate.categoryIdFirst.id && scope.cate.categoryIdSecond.id) {
                            scope.categoryIdFirstChange(scope.cate.categoryIdFirst, function(item) {
                                scope.cate.categoryIdSecond = getItemData(item, scope.cate.categoryIdSecond.id);
                            });
                        }

                        if (scope.cate.categoryIdFirst.id && scope.cate.categoryIdSecond.id && scope.cate.categoryIdThird.id) {
                            scope.categoryIdSecondChange(scope.cate.categoryIdSecond, function(item) {
                                scope.cate.categoryIdThird = getItemData(item, scope.cate.categoryIdThird.id);
                            });
                        }

                        if (scope.cate.categoryIdFirst.id && scope.cate.categoryIdSecond.id && scope.cate.categoryIdThird.id && scope.cate.categoryIdFourth.id) {
                            scope.categoryIdThirdChange(scope.cate.categoryIdThird, function(item) {
                                scope.cate.categoryIdFourth = getItemData(item, scope.cate.categoryIdFourth.id);
                            });
                        }

                        $rootScope.$broadcast('currentSelectedCateData', scope.getLastSelectedCateData());
                    });

                }

                setData();

                scope.$on('selectCategoryDataChange', function(event) {
                    setTimeout(function() {
                        setData();
                    }, 0);
                });


                // 在页面中，可通过此方法获取当前选定的类目值
                // $scope.$on("currentSelectedCateData", function (event, arr) {
                // });

            }
        };
    }]);
