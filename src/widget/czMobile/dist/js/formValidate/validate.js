/**
 * Created by chenmingkang on 16/3/11.
 *
 * 这里是校验公众的数据类型
 */

;(function(angular){
    angular.validateAddMethod = {
        phone : function(newVal){  //验证手机
            var res = new RegExp(/^1[3456789][0-9]{9}$/);
            return newVal && res.test(newVal);
        },
        mobileAndPhone : function(newVal){  //验证手机
            var res1 = new RegExp(/^1[3456789][0-9]{9}$/),
                res2 = new RegExp(/^[0-9]{3}-[0-9]{8}$/),
                res3 = new RegExp(/^[0-9]{4}-[0-9]{7,8}$/);
            return newVal && (res1.test(newVal) || res2.test(newVal) || res3.test(newVal) );
        },
        number : function(newVal){ //验证是否数字
            var res = new RegExp(/^[0-9]*$/);
            return newVal && res.test(newVal);
        },
        price : function(newVal){
            var res = new RegExp(/^\d+(\.\d+)?$/);
            return newVal && res.test(newVal);
        },
        priceUnZero : function(newVal){
            var res = new RegExp(/^\d+(\.\d+)?$/);
            return newVal && res.test(newVal) && newVal > 0;
        },
        equalTo : function(newVal,$elm){ //两端绑定
            var tarElm = function(){
                var id = $elm.attr('equal-to');
                return document.getElementById(id);
            }();
            return tarElm.value == newVal;
        },
        notChinese : function(newVal){
            var res = new RegExp(/[\u4e00-\u9fa5]+/);
            return newVal && !res.test(newVal);
        }
    };
})(angular);


//rule.phone = function(){
//    var res = new RegExp(/^1[3578][0-9]{9}$/);
//    scope.$watch(attrs.ngModel, function(newVal,lat){
//        if(!!newVal && newVal.length){
//            if(res.test(newVal)){
//                ngModelCtrl.$setValidity('phone', true);
//            }else{
//                ngModelCtrl.$setValidity('phone', false);
//            }
//        }else{
//            ngModelCtrl.$setValidity('phone', true);
//        }
//    });
//};
//rule.number = function(){
//    var res = new RegExp(/^[0-9]*$/);
//    scope.$watch(attrs.ngModel, function(newVal,lat){
//        if(!!newVal && newVal.length){
//            if(res.test(newVal)){
//                ngModelCtrl.$setValidity('number', true);
//            }else{
//                ngModelCtrl.$setValidity('number', false);
//            }
//        }else{
//            ngModelCtrl.$setValidity('number', true);
//        }
//    })
//},
//    rule.repeat = function(){
//        var repeat = angular.element(document.getElementById(elm.attr("repeat")));
//        var repeatVal = '';
//        var tarVal = '';
//        function repeatFn(){
//            if(tarVal.length > 0){
//                if(repeatVal == tarVal){
//                    ngModelCtrl.$setValidity('repeatMessage', true);
//                }else{
//                    ngModelCtrl.$setValidity('repeatMessage', false);
//                }
//            }else{
//                ngModelCtrl.$setValidity('repeatMessage', true);
//            }
//        };
//
//        repeat.on('keyup', function () {
//            repeatVal = this.value;
//            repeatFn();
//        });
//        scope.$watch(attrs.ngModel, function(newVal,lat){
//            tarVal = newVal || '';
//            repeatFn();
//        });
//    }
