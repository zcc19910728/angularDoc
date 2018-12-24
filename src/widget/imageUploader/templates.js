angular.module('__imageUploaderTemplates__', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('image-uploader-with-wrapper.html',

        `<div class="d-ib clearfix img-layer-wrapper"
            ng-model="show.imageList"
            ui-sortable="sortableOptions"
            >
                <div class="img-layer cornor"
                    ng-repeat="item in show.imageList track by $index"
                    ng-if="!item.isPlaceholder"
                    >
                    <div ng-if="!opt.viewMod" class="icon-overlay ta-c d-n">
                        <i class="iconfont cur-p remove-img" ng-click="deleteCurImage($index)">&#xe641;</i>
                    </div>
                    <img class="m-auto va-m img-show" ng-src="{{opt.prefix}}{{item.url}}{{opt.thumbnail}}">
                </div>
        </div>
        <div class="btn-addPic" ng-if="!opt.viewMod && isShowAddBtn">
            <input class="filePrew uploadPicBtn" type="file" ng-model="show.addBtn" ngf-accept="'image/jpg, image/jpeg, image/png, image/bmp'" ngf-select="onUpload($file, $files)" ngf-multiple="true" />
        </div>
    `);
}]);
