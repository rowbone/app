
## Angular responsive table   

#### 功能点：  
----------------- 

* `1.数据源[接口数据、json数据]`：   
* `分页`：   
* `单页显示条数[是否要使用者可以控制]`：   
* `1.开发控制页面内容[列名、哪些列小屏收起或者不显示]`：   
* `列控制可使用html`：   
* `1.参数控制刷新`：   
* `过滤搜索[前台、后台](筛选由开发提供模板)`：   
* `排序(参数做配置)`：   
* `1.单选返回</code>`：   
* `1.多选返回(电击确定返回)`：   
* `1.点击触发回调方法(跟选择操作逻辑分开)`：   
* `列宽控制`
* `横向滚动`
* 滚动到最上面head固定：   

#### 参考组件：   
------------------

* ng 版本   
  * https://github.com/esvit/ng-table   
  * https://github.com/gdepourtales/ng-cells   
  * https://github.com/samu/angular-table   
  * https://github.com/Swimlane/angular-data-table   
  * https://github.com/davidjnelson/angular-table   
  * https://github.com/Zizzamia/ng-tasty    

#### 功能对比：   
-------------   

<table class="table table-bordered table-striped table-condensed">
	<thead>
    <tr>
    	<th> 插件名称 </th>
    	<th> 分页 </th>
    	<th> 排序 </th>
    	<th> 过滤 </th>
    	<th> 分组 </th>
    	<th> 本页编辑 </th>
    	<th> 多选(checkbox) </th>
    	<th> 合计 </th>
    	<th> 导出 </th>
    	<th> 点击加载数据 </th>
    	<th> 滚动固定列 </th>
    </tr>
	</thead>
	<tbody>
    <tr>
    	<td> esvit/ng-table </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td>  </td>
    	<td>  </td>
    </tr>

    <tr>
    	<td> gdepourtales/ng-cells </td>
    	<td colspan="10"> 可以固定上下左右固定不滚动，可支持大数据量</td>    	
    </tr>

    <tr>
    	<td> samu/angular-table </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> N </td>
    	<td> N </td>
    	<td> N </td>
    	<td> N </td>
    	<td> N </td>
    	<td> N </td>
    	<td> N </td>
    </tr>

    <tr>
    	<td> angular-data-table </td>
    	<td> N </td>
    	<td> Y </td>
    	<td> N </td>
    	<td> Y </td>
    	<td> N </td>
    	<td> Y </td>
    	<td> N </td>
    	<td> N </td>
    	<td> Y </td>
    	<td> Y </td>
    </tr>

    <tr>
    	<td> davidjnelson/angular-table </td>
    	<td></td>    	
    	<td></td>    	
    	<td></td>    	
    	<td></td>    	
    	<td></td>    	
    	<td></td>    	
    	<td></td>    	
    	<td></td>    	
    	<td></td>    	
    	<td></td>    	
    </tr>

    <tr>
    	<td> Zizzamia/ng-tasty </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> Y </td>
    	<td> N </td>
    	<td> N </td>
    	<td> N </td>
    	<td> N </td>
    	<td> N </td>
    	<td>  </td>
    	<td>  </td>
    </tr>
	</tbody>
</table>