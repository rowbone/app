
## 字母分组选择说明   

### 业务逻辑   
- 数据源：   
	- 一次全部加载   
	- 点击加载   
- 展现结构   
	- 是否有common   
	- 是否所有字母都显示   
	- 没有内容不显示字母   
- 搜索   
	- 全部加载 - 前台过滤   
	- 点击加载 - 后台接口   
- 是否多选：   
	- 单选返回   
	- 多选点击"确定"返回   

### 参数说明：   
- dataSrcUrl: 'views/components/conow-country-sel/data/school/query-is-common-school.json',   
- isLoadingAll: false,   
- isHasCommon: true,   
- isShowAllLabels: true,   
- isShowSearch: true,   
- searchUrl: '',   
- isMultiSelect: false   