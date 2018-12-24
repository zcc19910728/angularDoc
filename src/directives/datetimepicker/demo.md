# 时间控件指令

## 何时使用
选择时间

## 代码演示

```js
/*angular*/
/*desc 时间控件desc*/

生效时间:
    <input type="text" class="ipt pl-10 pr-10 date" style="width:180px;" timepicker id="activityStartTime" ng-model="getData.activityStartTime" datetimepicker-opt="datetimepicker" />
    -
    <input type="text" class="ipt pl-10 pr-10 date" style="width:180px;" timepicker id="activityEndTime" ng-model="getData.activityEndTime" min-date="getData.activityStartTime" datetimepicker-opt="datetimepicker" />
    <span class="btn btn-blue ml-10" ng-click="submit()">提交</span>

<script>
    $scope.getData = {activityStartTime:'',activityEndTime:''};
    $scope.datetimepicker = {
        timepicker:true,
        format:'Y-m-d H:i',
        step:1
    };
    $scope.submit = function(){
        var params = {
            activityStartTime: $scope.getData.activityStartTime,
            activityEndTime: $scope.getData.activityEndTime
        }
        console.log(params)
    }
</script>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| format  | 日期格式 | string | Y/m/d H:i |
| timepicker   | 显示时间选择部分 | Boolean | true |
| datepicker   | 显示日期选择部分 | Boolean | true |
| minDate  | 设置可选择的最小日期（只有日期格式不包含时间部分才效） |  Boolean | false |
| maxDate   |  |  Boolean | false |
| minTime   |  |  Boolean | false |
| maxTime   |  |  Boolean | false |

> More options in [datetimepicker](https://xdsoft.net/jqplugins/datetimepicker/)
