/**
 * Created by chenmingkang on 16/1/15.
 */
;(function(angular){
    angular.inArray = function( elem, arr, i ) {
        var len;
        var deletedIds = [];
        var indexOf = deletedIds.indexOf;
        if ( arr ) {
            if ( indexOf ) {
                return indexOf.call( arr, elem, i );
            }
            len = arr.length;
            i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
            for ( var i = 0; i < len; i++ ) {
                if ( i in arr && arr[ i ] === elem ) {
                    return i;
                }
            }
        }

        return -1;
    };

    angular.param = function(obj) {

        if ( ! angular.isObject( obj) ) {
            return( ( obj== null ) ? "" : obj.toString() );
        }
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];
            if(value instanceof Array) {
                for(i in value) {
                    subValue = value[i];
                    fullSubName = name + '['+ i +']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += arguments.callee(innerObj) + '&';
                }

            } else if(value instanceof Object) {
                for(subName in value) {

                    subValue = value[subName];
                    fullSubName = name + '.' + subName;
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += arguments.callee(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };



    angular.isObjectValueEqual = function(a, b) {
        // Of course, we can do it use for in
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    };

    angular.addEditSelect = function(data,item){
        var dataIndex = data.indexOf(item);

        if(dataIndex > -1){
            data.splice(dataIndex,1)
        }else{
            data.push(item)
        }
    };

    angular.addEditJson = function(opt){
        var isSelect = false;
        var o = {
            data : [],
            item : {},
            itemCell : {},
            name : '',
            useSpec : false, //以批次为维度
            specListName : '',
            batchId : '',
            selectAll : false,
            forSelectCallback   : function(){

            },
            selectCallback : function(){

            },
            removeCallback : function(){

            }
        };

        angular.extend(o,opt);

        if(o.item instanceof Array){
            o.item.forEach(function(childItem,index){
                var forData = angular.extend(o,{item : childItem});
                return angular.addEditJson(forData);
            });
        }else{
            if(!o.useSpec){
                o.data.forEach(function(selectItem,index){
                    if(selectItem[o.name] === o.item[o.name]){
                        isSelect = true;
                        if(!o.selectAll){
                            o.data.splice(index,1);
                            o.removeCallback(o.item);
                        }
                        return;
                    }
                o.forSelectCallback(selectItem);
                });
            }else{

                //同个商品-同个批次
                var bacthSelectedNum = 0;
                o.item[o.specListName].forEach(function(specItem,i){
                    if(specItem.selected){
                        bacthSelectedNum++;
                    }
                });

                o.data.forEach(function(selectItem,index){

                    if(selectItem[o.name] === o.item[o.name] && bacthSelectedNum === 0){ //0代表这个批次的所有规格一个都没被选中，需要删除这个批次
                        isSelect = true;
                        if(!o.selectAll){
                            o.data.splice(index,1);
                            o.removeCallback(o.item);
                        }
                        return;
                    }

                    if(selectItem[o.name] === o.item[o.name] && bacthSelectedNum === 2){//在同批次不同规格间切换
                        isSelect = true;
                        o.data.splice(index,1,o.item);//需要重新塞入，不然查看全部商品后对象指向地址就不是同一个了
                    }

                    //同个商品-不同批次
                    if(selectItem[o.name] === o.item[o.name] && selectItem[o.batchId] !== o.item[o.batchId]){
                        isSelect = true;
                        if(!o.selectAll){
                            //先取消selected再移除
                            selectItem[o.specListName].forEach(function(specItem,i){
                                specItem.selected = false;
                            });
                            o.data.splice(index,1,o.item);
                        }
                    }

                    o.forSelectCallback(selectItem, o.itemCell);
                });
            }

            //不同商品
            if((!o.data.length && !isSelect) || !isSelect){
                o.data.push(o.item);
                o.selectCallback(o.item);
                o.forSelectCallback(o.item, o.itemCell);
            }
        }
    };

    angular.pushTarData = function(data,tarData,name,isEmpty){
        var data = name ? data[name] : data;

        if(isEmpty){
            tarData = [];
        }
        if(typeof data === 'object' &&  !data instanceof Array){
            angular.forEach(data,function(item){
                return angular.pushTarData(item,tarData);
            });
            return;
        }
        tarData.push(data);
        return tarData
    };

    return angular;

})(angular || {});