angular.module('image-uploader', ['__imageUploaderTemplates__']).provider('imageUploaderConfig', function() {
    this.options = {
        imageList: [], // 已上传图片地址列表
        max: 20, // 最大上传图片数
        prefix: '//staticonline.hipac.cn/', // 域名
        uploadUrl: '/item/apply/itemApplyUploadImg.json', // 上传地址
        maxSize: 1000, // 图片最大空间占用 (KB)
        equalToWidth: 0, // 限制图片仅为当前宽度 (px), 设置为 0 则不限制
        equalToHeight: 0, // 限制图片仅为当前高度 (px)
        minWidth: 20, // 限制图片最小高宽 (px)
        minHeight: 20,
        thumbnail: '', // 默认取原图 缩略图请添加参数 @100w
        multiple: true, // 默认支持多个上传 (invalid)
        serverUrl: '/pub/common/img/getServerSignature.json', // 支持oss直传 (invalid)
        viewMod: false, // 默认展示删除按钮
    };

    this.$get = function() {
        var options = this.options;
        return {
            getOptions: function(params) {
                return angular.extend({}, options, params);
            },
        };
    };

    this.setOptions = function(options) {
        angular.extend(this.options, options);
    };
}).service('imageUploaderService', ['$http', function($http) {
    // this.upload = function(postData,callback){
    //     $http({
    //         method:'POST',
    //         cache: true,
    //         url: '/seller/item/upload.json',
    //         dataType: 'json',
    //         data  : postData
    //     }).success(callback);
    // };
}]).directive('imageUploaderWithWrapper', ['$rootScope', 'Upload', '$timeout', '$cacheFactory', 'messageFactory', 'imageUploaderConfig', 'imageUploaderService', function($rootScope, Upload, $timeout, $cacheFactory, messageFactory, imageUploaderConfig, imageUploaderService) {
    return {
        restrict: 'AE',
        templateUrl: 'image-uploader-with-wrapper.html',
        // replace: true,
        // transclude: true,
        scope: {
            img: '=',
        },
        link: function(scope, element) {

            scope.opt = imageUploaderConfig.getOptions(scope.img);

            // init addBtn
            scope.show = {
                addBtn: '',
                imageList: []  // 组件内展示
            };
            scope.isShowAddBtn = true;

            // 更新图片展示内容
            scope.updateImageList = function() {
                let imageList = scope.show.imageList;
                scope.opt.imageList.length = 0;
                imageList
                    .filter(v => !v.isPlaceholder)
                    .map(v => v.url)
                    .forEach(v => {
                        scope.opt.imageList.push(v);
                    });

                scope.img.imageList = scope.opt.imageList;
            };

            scope.checkMaxUploaded = function() {
                scope.opt.max = scope.img.max || scope.opt.max;
                scope.opt.viewMod = scope.img.viewMod || scope.opt.viewMod;

                // directive inside ng-if
                if (scope.img && (scope.img.imageList.length >= scope.opt.max)) {
                    scope.isShowAddBtn = false;
                } else {
                    scope.isShowAddBtn = true;
                }
            };

            // watch 页面图片列表参数
            scope.$watch('img', function(){
                // directive inside ng-if
                if (scope.img && scope.img.imageList && scope.img.imageList.length) {
                    for (let i = 0; i < scope.show.imageList.length; i += 1) {
                        const item = scope.show.imageList[i];
                        if (scope.img.imageList.some(v => v === item.url)) {
                            continue;
                        }
                        if (!item.isPlaceholder) {
                            scope.show.imageList.splice(i, 1);
                            i -= 1;
                        }
                    }

                    scope.img.imageList.forEach((v) => {
                        if (scope.show.imageList.some(sv => sv.url === v)) {
                            return;
                        }
                        var o = {
                            isPlaceholder: false,
                            url: v,
                        };

                        scope.show.imageList.push(o);
                    });
                }

            }, true);

            if (!(scope.opt) || !(scope.opt.imageList instanceof Array)) {
                throw new Error('imageList must be an array');
            }

            // 预处理图片
            scope.preloadImage = function(files) {
                var url = window.URL || window.webkitURL;
                return Promise.all(
                    files.map(
                        file => new Promise(rs => {
                            var img = new Image();

                            img.onload = function() {
                                file.width = this.width;
                                file.height = this.height;

                                rs();

                                // GC
                                img = null;
                            };

                            img.src = url.createObjectURL(file);
                        })
                    )
                );
            };

            // 图片校验
            scope.isValid = function(files) {
                if (!files) {
                    return false;
                }

                if (files && files.length === 0) {
                    return false;
                }

                if ((scope.opt.max - scope.img.imageList.length) < files.length) {
                    messageFactory({
                        text: '上传图片数量超过限制！'
                    });
                    return false;
                }

                var flag = false;

                angular.forEach(files, function(item) {

                    if (item.size > (scope.opt.maxSize * 1024)) {
                        messageFactory({
                            text: '图片大小超过限制！'
                        });
                        flag = true;
                        return false;
                    }

                    if (scope.opt.equalToWidth && item.width != scope.opt.equalToWidth) {
                        messageFactory({
                            text: '图片宽度不等于 ' + scope.opt.equalToWidth + ' px！'
                        });
                        flag = true;
                        return false;
                    }
                    if (scope.opt.equalToHeight && item.height != scope.opt.equalToHeight) {
                        messageFactory({
                            text: '图片高度不等于 ' + scope.opt.equalToHeight + ' px！'
                        });
                        flag = true;
                        return false;
                    }

                    if (scope.opt.minWidth && item.width < scope.opt.minWidth) {
                        messageFactory({
                            text: '图片宽度应大于 ' + scope.opt.minWidth + ' px！'
                        });
                        flag = true;
                        return false;
                    }
                    if (scope.opt.minHeight && item.height < scope.opt.minHeight) {
                        messageFactory({
                            text: '图片高度应大于 ' + scope.opt.minHeight + ' px！'
                        });
                        flag = true;
                        return false;
                    }
                });

                if (flag) {
                    return false;
                }

                return true;
            };

            scope.onUpload = async function(file, files) {
                await scope.preloadImage(files);

                // 等待获取图片高宽
                if (!scope.isValid(files)) {
                    return false;
                }

                // 图片上传
                let imageList = scope.show.imageList;
                files.forEach((file) => {
                    const image = {
                        isPlaceholder: true,
                        url: '',
                    };

                    scope.show.imageList.push(image);

                    Upload.upload({
                        url: '/seller' + scope.opt.uploadUrl,
                        data: {
                            picture: file,
                            width: file.width || '',
                            height: file.height || '',
                        }
                    }).then(function (resp) {
                        $timeout(function () {
                            if (resp.data && resp.data.data) {
                                image.isPlaceholder = false;
                                image.url = resp.data.data;
                            }

                            // 清空当前上传按钮
                            scope.show.addBtn = '';
                            scope.updateImageList();
                            scope.checkMaxUploaded();
                        });
                    }, function (response) {
                        imageList.splice(imageList.indexOf(image), 1);

                        if (response.status > 0) {
                            messageFactory({
                                text: '图片上传失败！'
                            });
                        }
                        scope.updateImageList();
                    });
                });

            };

            scope.deleteCurImage = function(index) {
                scope.show.imageList.splice(index, 1);
                scope.updateImageList();
                scope.checkMaxUploaded();
            };

            // ui.sortable
            scope.sortableOptions = {
                'ui-floating': true,
                'update': () => {
                    setTimeout(() => {
                        scope.updateImageList();
                    });
                }
            };

            // 初始化判断是否展示上传按钮
            setTimeout(function() {
                scope.checkMaxUploaded();
            }, 0);

            scope.$on('checkImageMaxUploaded', function(event) {
                if (event.currentScope) {
                    scope.checkMaxUploaded();
                }
                setTimeout(function() {
                    scope.checkMaxUploaded();
                }, 0);
            });
        }
    };
}]);
