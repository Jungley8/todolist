Date.prototype.Format = function (fmt) {
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
var model = {};
var todoApp = angular.module("todoApp", []);
//这里的$http相当于ajax服务  调用时用run
todoApp.run(function($http) {
    $http.get("todo.json").success(function(data) {
        model.items = data; //从json文件中接收数据到model
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

todoApp.controller("ToDoCtrl", function($scope) {
    $scope.todo = model;

    $scope.incompleteCount = function() {
        var count = 0;
        angular.forEach($scope.todo.items, function(item) {
            if (!item.done) {
                count++
            }
        });
        return count;
    }

    $scope.completeCount = function() {
        var count = 0;
        angular.forEach($scope.todo.items, function(item) {
            if (item.done) {
                count++
            }
        });
        return count;
    }

    $scope.warningLevel = function() {
        return $scope.incompleteCount() < 3 ? "label-success" : "label-warning";
    }

    $scope.addNewItem = function(actionText) {
        if(!actionText){
            mui.toast('任务不能为空')
            return false
        }
        $scope.todo.items.push({
            action: actionText,
            done: false,
            time: new Date().Format("yyyy-MM-dd hh:mm:ss")
        });
        $scope.actionText = ''
    }
});
