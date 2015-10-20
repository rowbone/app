
conow-pagination 指令说明   
============================   

### 基本原则   

- 所有分页的场景都会使用[通用性]   
- 接口、样式统一[一致性]   
- 基于ui.bootstrap.pagination   

### 参数列表   

#### 用户参数   

- currentPage: 当前页   
- pageSize: 每页的数据条数   
- totalItems: 数据总数[注意，必须是双向的]     

#### 默认参数   

- currentPage: 1
- pageSize: 10
- directionLinks: true,  // Whether to display Previous / Next buttons.
- boundaryLinks: false,           // Whether to display First / Last buttons
- previousText: '< 上一页',
- nextText: '下一页 >',
- templateUrl: 'views/components/conow-pagination/tpls/conow-pagination.html'

### 方法     

- 改变页码的方法：change    
- 触发发起请求操作

