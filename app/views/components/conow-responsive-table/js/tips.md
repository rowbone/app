
## object-table tips   

### orderBy 、 globalSearch 、offset 、limitTo 都放在 template 时生成的 repeat 。需要移出来，在 controller 中对数据进行处理，得到$ filtered   

ng-repeat-start="item in $filtered = (data| orderBy:sortingArray| filter:globalSearch) | offset: currentPage:display |limitTo: display"