angular.module('__chinaAreaSelectorTemplates__', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('china-area-selector-with-wrapper.html',`
        <select name="province" class="d-ib select w-100px select mr-10" ng-options="province.areaName for province in provinces" ng-model="region.province" ng-change="provinceChange(region.province.id, '', true)">
            <option value="">请选择省</option>
        </select>
        <select name="city" class="d-ib select mr-10 w-100px select" ng-options="city.areaName for city in citys" ng-model="region.city" ng-change="cityChange(region.city.id, '', true)">
            <option value="">请选择市</option>
        </select>
        <select name="area" class="d-ib select mr-10 w-100px select" ng-options="area.areaName for area in areas" ng-hide="{{region.hideArea}}" ng-model="region.area" ng-change="areaChange(region.area.id, '', true)">
            <option value="">请选择区</option>
        </select>
        `);
}]);