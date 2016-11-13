Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var model = {},
    maxid = 0;
var todoApp = angular.module("todoApp", ['ngRoute']);
todoApp.run(function($http) {
    $http.get("todo.json").success(function(data) {
        mui.each(data, function(i, e) {
            if (e.id > maxid) {
                maxid = e.id
            }
        })
        model = data; //从json文件中接收数据到model
    });
});
todoApp.filter("checkedItems", function() { //这里定义了一个过滤器checkedItems
    return function(items, showComplete) {
        var resultArr = [];
        angular.forEach(items, function(item) {
            if (item.done == showComplete) {
                resultArr.push(item); //item是未完成事项 或 showComplete == true时放入
            }
        });
        return resultArr;
    }
});
// 任务列表
todoApp.controller("ToDoList", function($scope, $location) {
    $scope.todo = model;

    $scope.incompleteCount = function() {
        var count = 0;
        angular.forEach($scope.todo, function(item) {
            if (!item.done) {
                count++
            }
        });
        return count;
    }

    $scope.completeCount = function() {
        var count = 0;
        angular.forEach($scope.todo, function(item) {
            if (item.done) {
                count++
            }
        });
        return count;
    }

    $scope.direct = function(id) {
        $location.path('/detail/' + id);
    }

    $scope.warningLevel = function() {
        return $scope.incompleteCount() < 3 ? "mui-badge-success" : "mui-badge-warning";
    }

    $scope.addNewItem = function(actionText) {
        if (!actionText) {
            mui.toast('任务不能为空')
            return false
        }
        $scope.todo.push({
            id: ++maxid,
            action: actionText,
            done: false,
            time: new Date().Format("yyyy-MM-dd hh:mm:ss")
        });
        model = $scope.todo;
        $scope.actionText = ''
    }
});
// 任务详细
todoApp.controller('ToDoDetail', function($scope, $routeParams, $location) {
    $scope.id = $routeParams.id;
    mui.each(model, function(index, el) {
        if (el.id == $scope.id) {
            $scope.detail = el;
        }
    });
    $scope.delete = function(id) {
        mui.each(model, function(index, val) {
            if (val.id == id) {
                delete model[index]
            }
        });
        $location.path('/');
    }
});
// 配置路由
todoApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'list.html',
            controller: 'ToDoList'
        })
        .when('/detail/:id', {
            templateUrl: 'detail.html',
            controller: 'ToDoDetail'
        })
        .otherwise({
            redirectTo: '/'
        });
});
