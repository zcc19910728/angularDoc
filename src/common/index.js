function bindEvent(){
    $('.showMoreBtn').on('click',function(){
        $(this).closest('.contentWrap').find('.contentJs').toggle();
    })
}

var id = 1;
function renderComponent(id) {
    
    setTimeout(function () {
        var script = document.getElementById(id).getElementsByTagName("script")[0].innerHTML;

    app.controller('mainController',['$scope','$compile','$parse','ngDialog', function($scope,$compile,$parse,ngDialog) {
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
        function(hook, vm) {
          hook.init(function() {
            // Called when the script starts running, only trigger once, no arguments,
          });
    
          hook.beforeEach(function(content) {
            // Invoked each time before parsing the Markdown file.
            // ...
            return content;
            return (
                '<div ng-app="app" ng-controller="mainController">' +
                content +
                '<div>'
              );
          });
    
          hook.afterEach(function(html, next) {
            // Invoked each time after the Markdown file is parsed.
            // beforeEach and afterEach support asynchronous。
            // ...
            // call `next(html)` when task is done.
            next(html);
          });
    
          hook.doneEach(function() {
            // Invoked each time after the data is fully loaded, no arguments,
            // ...
          });
    
          hook.mounted(function() {
            // Called after initial completion. Only trigger once, no arguments.
          });
    
          hook.ready(function() {
            // Called after initial completion, no arguments.
          });
        }
      ]
  }