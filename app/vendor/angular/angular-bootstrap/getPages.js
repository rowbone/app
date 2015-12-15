
function getPages(currentPage, totalPages) {
	var pages = [],
		page = null, 
		startPage = 1, 
		endPage = totalPages, 
		middlePagesCount = 0,		// 除去第一页和最后一页的页码数量
		isMaxSized = (angular.isDefined(maxSize) && maxSize < totalPages), 
		pageNumber = 1, 
		pageText = 1;

	// Add page number links
	if(angular.isDefined(maxSize)) {
		if(maxSize >= totalPages) {
			for(var i=startPage; i<=totalPages; i++) {
				page = makePage(i, i, i === currentPage);
				pages.push(page);
			}
		// 需要显示省略号的情况
		} else {
			middlePagesCount = maxSize - 2;
			// 后面显示一个省略号
			if((currentPage - startPage) <= (middlePagesCount - 2)) {
				for(var i=1; i<=middlePagesCount; i++) {
					pageNumber = startPage + i;
					pageText = (i === middlePagesCount) ? '...' : pageNumber;

					page = makePage(pageNumber, pageText, pageNumber === currentPage);
					pages.push(page);
				}
			// 前面显示一个省略号
			} else if((totalPages - currentPage) <= (middlePagesCount - 2)) {
				for(var i=middlePagesCount; i>=1; i--) {
					pageNumber = endPage - i;
					pageText = (i === middlePagesCount) ? '...' : pageNumber;
					page = makePage(pageNumber, pageText, pageNumber === currentPage);
					pages.push(page);
				}
			// 显示两个省略号
			} else {
				var middleLeft = Math.floor(middlePagesCount / 2);
				var min = currentPage - middleLeft;
    			var max = min + middlePagesCount;
    			// if(middlePagesCount % 2) {
    			// 	max = max + 1;
    			// }
				for(var i = min; i < max; i++) {
					pageNumber = i;
					pageText = ((i === min) || (i === max -1)) ? '...' : pageNumber;
					page = makePage(pageNumber, pageText, pageNumber === currentPage);
					pages.push(page);
				}
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