
function getPages(currentPage, totalPages) {
	var pages = [],
		page = null, 
		startPage = 1,
		endPage = totalPages,
		isMaxSized = (angular.isDefined(maxSize) && maxSize < totalPages),
		middlePagesCount = 0,
		maxMiddlePagesCount = 0;

	// Add page number links
	if(angular.isDefined(maxSize)) {
		if(maxSize >= totalPages) {
			for(var i=startPage; i<totalPages; i++) {
				page = makePage(i, i, i === currentPage);
				pages.push(page);
			}
		// 需要显示省略号的情况
		} else {
			middlePagesCount = maxSize - 2;
			// 后面显示一个省略号	startPage + 1/startPage + 2/...
			if(currentPage - startPage <= 4) {
				page = makePage(startPage + 1, startPage + 1, (startPage + 1) === currentPage);
				pages.push(page);
				page = makePage(startPage + 2, startPage + 2, (startPage + 2) === currentPage);
				pages.push(page);
				page = makePage(startPage + 3, startPage + 3, (startPage + 3) === currentPage);
				pages.push(page);
				page = makePage(startPage + 4, startPage + 4, (startPage + 4) === currentPage);
				pages.push(page);
				page = makePage(startPage + 5, '...', (startPage + 5) === currentPage);
				pages.push(page);
			// 前面显示一个省略号 .../endPage - 2/ endPage - 1
			} else if(totalPages - currentPage <= 4) {
				page = makePage(endPage - 5, '...', (endPage - 5) === currentPage);
				pages.push(page);
				page = makePage(endPage - 4, endPage - 4, (endPage - 4) === currentPage);
				pages.push(page);
				page = makePage(endPage - 3, endPage - 3, (endPage - 3) === currentPage);
				pages.push(page);
				page = makePage(endPage - 2, endPage - 2, (endPage - 2) === currentPage);
				pages.push(page);
				page = makePage(endPage - 1, endPage - 1, (endPage - 1) === currentPage);
				pages.push(page);
			// 显示两个省略号	currentPage - 1/currentPage/currentPage + 1
			} else {
				page = makePage(currentPage - 2, '...', false);
				pages.push(page);
				page = makePage(currentPage - 1, currentPage - 1, false);
				pages.push(page);
				page = makePage(currentPage, currentPage, true);
				pages.push(page);
				page = makePage(currentPage + 1, currentPage + 1, false);
				pages.push(page);
				page = makePage(currentPage + 2, '...', false);
				pages.push(page);
			}
			var firstPageSet = makePage(startPage, startPage, startPage === currentPage);
			var lastPageSet = makePage(endPage, endPage, endPage === currentPage);
			pages.unshift(firstPageSet);
			pages.push(lastPageSet);
		}
	} else {
		for(var i=startPage; i<totalPages; i++) {
			page = makePage(i, i, i === currentPage);
			pages.push(page);
		}
	}

	// Add links to move between page sets
    if ( isMaxSized && ! rotate ) {
      if ( startPage > 1 ) {
        var previousPageSet = makePage(startPage - 1, '...', false);
        pages.unshift(previousPageSet);
      }

      if ( endPage < totalPages ) {
        var nextPageSet = makePage(endPage + 1, '...', false);
        pages.push(nextPageSet);
      }
    }

	return pages;
}

/**
 * maxSize 5
 *
 * 1.totalPages < maxSize:全部显示
 * 2.去除首尾 maxSize - 2 == 3
 * 3.if currentPage - 1 <= 2 || totalPages - currentPage <= 2 显示一个 ...
 * 4.显示两个 ...，最中间显示 currentPage * 
 */