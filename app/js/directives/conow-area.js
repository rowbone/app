'use strict';

app.directive('conowArea', function() {
    return {
        restrict: 'E',
        replace: true,
        require: '^ngModel',
        scope:{
        	displayRoot:'@displayRoot',				//判断input框是否显示省份
        	regionType:'@regionType',				//地区类型：省份、城市、乡村...
        	ngModel:'='
        },
        template:'<div><input class="form-control text-danger-dker" type="text" display-root="{{displayRoot}}" mod="address|notice" mod_address_type="{{regionType}}" mod_address_source="hotel" mod_notice_tip="中文/拼音">'
        	+'<input ng-model="ngModel" type="hidden" onchange="angular.element(this).scope().bindModel(this.value)"/></div>',
        compile: function(element, attributes) {
            return {
                pre: function preLink($scope, $element,$attrs) {
                	var displayId = new UUID();
                	var codeId = new UUID();
                	var displayElement = $element.find('input:eq(0)');
                	var valueElement = $element.find('input:last');
                	
                	displayElement.attr('id',displayId);
                	displayElement.attr('mod_address_reference',codeId);
                	valueElement.attr('id',codeId);
                	valueElement.attr('name',codeId);
                	valueElement.attr('value','{$'+codeId+'}');
                },  
                post: function postLink($scope, $element,$attrs) {
                	$scope.bindModel = function(value){
                		$scope.$apply(function(){
                			$scope.ngModel = value;
                		});
                    };
                	$scope.$watch('ngModel',function(){
                		var displayElement = $element.find('input:eq(0)');
                		if($scope.ngModel !=null && $scope.ngModel != ''){
                			$element.find('input:eq(1)').val($scope.ngModel);
	                    	if($scope.regionType == "nation"){
                    			displayElement.val(nation[$scope.ngModel][0]);
	                    	}else{
                				if($scope.displayRoot == 'true'){			//若为true，则显示全路径
	                    			displayElement.val(getRegionWithRoot($scope.ngModel));
	                    		}else{
	                    			displayElement.val(region[$scope.ngModel][0]);
	                    		}
	                    	}
                    	}else{
                    		displayElement.val("");
                    	}
                    });
                	
                	$element.ready(function($timeout){
                		$timeout(function() {
                			var displayInput = $element.find('input').get(0);
                			if(displayInput != null){
                				//地区控件中的方法，渲染地区组件
                				renderRegionElements(displayInput);
                			}
        				});
                	}); 
                }  
            };  
        }
    };
});

function getRegionWithRoot(code){
	var regionForDisplay = null;
	if(new RegExp("[0-9][0-9][0-9][0-9][0-9][0-9]00").test(code) && !new RegExp("[0-9][0-9][0-9][0-9]0000").test(code)){
    	var province = code.substr(0,2)+"000000";
    	var city =code.substr(0,4)+"0000";
    	regionForDisplay = (region[province]!=null?region[province][0]+"-":"")+(region[city]!=null?region[city][0]+"-":"")+region[code][0];
    }else if(new RegExp("[0-9][0-9][0-9][0-9]0000").test(code) && !new RegExp("[0-9][0-9]000000").test(code)){
    	var province = code.substr(0,2)+"000000";
    	regionForDisplay = (region[province]!=null?region[province][0]+"-":"")+region[code][0];
    }else if(new RegExp("[0-9][0-9]000000").test(code)){
    	regionForDisplay = region[code][0];
    }
	return regionForDisplay;
}
