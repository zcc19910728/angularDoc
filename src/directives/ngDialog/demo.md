# 弹窗指令

## 何时使用
提示文案的时候

## 代码演示

```js
/*angular*/
/*desc 提示文案 desc*/
<button ng-click="dialog()">点我</button>


<script>
    $scope.dialog = function(){
        console.log(999)
        ngDialog.open({
            template: '顶顶顶顶',
            overlay: true,
                    plain: true,
        });
    }
</script>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 所需icon值 | string |  |