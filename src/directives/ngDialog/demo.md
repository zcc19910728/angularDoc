# 弹窗指令

## 何时使用
提示文案或者弹窗交互的时候

## 代码演示

```js
/*angular*/
/*desc 弹窗 desc*/

<span class="btn btn-blue ml-10" ng-click="batchAddRemark()">批量标记</span>
<script>
    $scope.batchAddRemark = function(){
        ngDialog.open({
            template: `
            <h2 class="ngdialog-title">批量标记</h2>
            <div class="ta-l p-20 pos-r">
                <div>
                    <span>订单标记：</span>
                    <textarea ng-model="remark" class="va-t p-5" placeholder='标记信息作为你对这笔订单的标记记录' name='remark' id='remark' maxLength='100' style="width:350px;height:100px;"></textarea>
                </div>
                <div class="mt-20 ta-r">
                    <a class="btn btn-secondary ml-20" ngdialog-close>取消</a>
                    <a class="btn btn-blue ml-10" ng-click="confirm()">保存</a>
                </div>
            </div>`,
            width: '500px',
            overlay: true,
            plain: true,
            closeByEscape: false,
            closeByNavigation: false,
            closeByDocument: false,
            scope: $scope,
            controller: ['$scope', function($scope) {
                $scope.confirm = function() {
                    var ids = [];

                    var params = {
                        orderIds: ids,
                        orderRemark: $scope.remark
                    }

                    if(!$.trim(params.orderRemark)){
                        console.log(messageFactory)
                        messageFactory({
                            'text': '请填写订单标记内容'
                        });
                        return false;
                    }

                    if(true){ // 一些异步操作
                        console.log(params)
                        ngDialog.close();
                        messageFactory({text : '操作成功'});
                    }

                };
            }]
        });
    }
</script>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| template  | 弹框展示的模板 | string | --- |
| plain   | 是否允许使用纯字符串作为模板 | Boolean | false |
| controller   | 对话窗口的控制器。 控制器可以通过名称引用或直接内联来指定 | {String} | {Array} | {Object} | --- |
| resolve  | 给控制器注入依赖关系映射 |  {Object.<String, Function>} | --- |
| showClose   | 是否展现dialog框关闭按钮 |  Boolean | false |
| scope   | 将scope对象传递给对话框。如果使用具有单独的$scope服务的控制器，则此对象将被传递到$scope.$parent |  Object | --- |
| className   | 此选项用于控制对话框的外观，可以使用内置主题或创建自己的样式模式。 |  String | --- |

> More options in [ngDialog](https://blog.csdn.net/Wonder233/article/details/76152599)
