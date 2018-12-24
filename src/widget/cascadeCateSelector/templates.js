angular.module('__cascadeCateSelectorTemplates__', []).run(['$templateCache', function($templateCache) { $templateCache.put('cascade-cate-selector-with-wrapper.html',`
    <ui-select class="d-ib w-150px" ng-model="cate.categoryIdFirst" on-select="categoryIdFirstChange(cate.categoryIdFirst)" theme="select2">
    <ui-select-match placeholder="请选择类目">
        {{$select.selected.name}}
        <abbr class="iconfont select2-search-choice-close d-ii" ng-click="onRemove($event, 1)"></abbr>
    </ui-select-match>
    <ui-select-choices repeat="carrier in categoryIdFirst | filter: $select.search">
        <div ng-bind-html="carrier.name | highlight: $select.search"></div>
    </ui-select-choices>
    </ui-select>
    <ui-select class="d-ib w-150px" ng-model="cate.categoryIdSecond" on-select="categoryIdSecondChange(cate.categoryIdSecond)" theme="select2" ng-if="categoryIdSecond.length && cate.categoryIdFirst.childrenCategory.length && opt.selectShowLv2">
    <ui-select-match placeholder="请选择类目">
        {{$select.selected.name}}
    </ui-select-match>
    <ui-select-choices repeat="carrier in categoryIdSecond | filter: $select.search">
        <div ng-bind-html="carrier.name | highlight: $select.search"></div>
    </ui-select-choices>
    </ui-select>
    <ui-select class="d-ib w-150px" ng-model="cate.categoryIdThird" theme="select2" on-select="categoryIdThirdChange(cate.categoryIdThird)" ng-if="categoryIdFirst.length && categoryIdSecond.length && cate.categoryIdSecond.childrenCategory.length && opt.selectShowLv3">
    <ui-select-match placeholder="请选择类目">
        {{$select.selected.name}}
    </ui-select-match>
    <ui-select-choices repeat="carrier in categoryIdThird | filter: $select.search">
        <div ng-bind-html="carrier.name | highlight: $select.search"></div>
    </ui-select-choices>
    </ui-select>
    <ui-select class="d-ib w-150px" ng-model="cate.categoryIdFourth" theme="select2" on-select="categoryIdFourthChange(cate.categoryIdFourth)" ng-if="categoryIdFirst.length && categoryIdSecond.length && categoryIdThird.length && cate.categoryIdThird.childrenCategory.length && opt.selectShowLv4">
    <ui-select-match placeholder="请选择类目">
        {{$select.selected.name}}
        </ui-select-match>
    <ui-select-choices repeat="carrier in categoryIdFourth | filter: $select.search">
        <div ng-bind-html="carrier.name | highlight: $select.search"></div>
    </ui-select-choices>
    </ui-select>
    `);
}]);