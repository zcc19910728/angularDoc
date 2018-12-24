function bindEvent(){
    $('.showMoreBtn').on('click',function(){
        $(this).closest('.contentWrap').find('.contentJs').toggle();
    })
}

var id = 1;
var flag = false;
function renderComponent(id) {
    
    setTimeout(function () {
        var scripts = document.getElementById(id).getElementsByTagName("script");

        app.controller('mainController',['$scope',
                                        '$compile',
                                        '$parse',
                                        'ngDialog',
                                        'messageFactory'
                                        ,'$timeout', function(
                                        $scope,
                                        $compile,
                                        $parse,
                                        ngDialog,
                                        messageFactory,
                                        $timeout) {
            var script = '';
            if(scripts.length){
                $.each(scripts,function(index,item){
                    script += item.innerHTML;
                })
            }
            try{
                eval(script)
            }catch(e){
                console.log(e)
            }
            
        }])
        angular.bootstrap(document.getElementById(id),["app"]);
        bindEvent();
    });
}

// 全局配置
window.$docsify = {
    name: '',
    repo: '',
    loadSidebar: './src/common/sidebar.md', // 侧边栏
    subMaxLevel: 2, // 目录层级
    loadNavbar: './src/common/nav.md', // 顶部导航栏
    search: {
        maxAge: 86400000, // 过期时间，单位毫秒，默认一天
        paths: 'auto',
        placeholder: '搜索',
        noData: '找不到结果',
        depth: 2 // 搜索标题的最大程级, 1 - 6
    },
    markdown: {
        smartypants: true,
        renderer: {
            code: function code(_code, lang) {
              if (/^\/\*\s*angular\s*\*\//.test(_code)) {
                id++;
                renderComponent(id);
                var desc =  _code.match(/\/\*desc.*desc\*\//)[0].replace(/\/\*desc(.*)desc\*\//,'$1');
                var html = '<div>'+
                                '<div style="border: 1px solid #ebedf0;padding: 42px 24px 50px;border-radius: 2px 2px 0 0;" ng-app="app" ng-controller="mainController" id="'+ id +'">'+ _code.replace(/^\/\*\s*angular\s*\*\//,'').replace(/\/\*desc.*desc\*\//,'') +'</div>' +
                                '<div class="of-h contentWrap" style="border: 1px solid #ebedf0;border-top:none;padding: 18px 32px;border-radius: 0 0 2px 2px;">'+
                                    '<div class="of-h" style="min-height:30px;">'+ desc +'<span style="font-size:20px;" class="f-r mt-5 cur-p iconfont showMoreBtn">&#xe620;</span></div>'+
                                    '<div class="d-n contentJs">'+
                                        this.origin.code.apply(this, arguments)+
                                    '</div>'+
                                '</div>'+
                            '</div>';

                return html;
              }
    
              return this.origin.code.apply(this, arguments);
            }
        }
    },
    plugins: [
        function (hook, vm) {
          hook.init(function() {
            // 初始化时调用，只调用一次，没有参数。
            var flag = false;
          })
      
          hook.beforeEach(function(content) {
            // 每次开始解析 Markdown 内容时调用
            // ...
            $('#messageTop').remove()
            
            return content
          })
      
          hook.afterEach(function(html, next) {
            // 解析成 html 后调用。beforeEach 和 afterEach 支持处理异步逻辑
            // ...
            // 异步处理完成后调用 next(html) 返回结果
            next(html)
          })
      
          hook.doneEach(function() {
            // 每次路由切换时数据全部加载完成后调用，没有参数。
            // ...
          })
      
          hook.mounted(function() {
            // 初始化完成后调用 ，只调用一次，没有参数。
          })
      
          hook.ready(function() {
            // 初始化并第一次加完成数据后调用，没有参数。
            flag = false;
          })
        }
    ]
  }