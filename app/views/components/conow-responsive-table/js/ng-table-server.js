(function(angular, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(window.angular || null, function(angular) {
    'use strict';

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    /**
     * @ngdoc module
     * @name ngTable
     * @description ngTable: Table + Angular JS
     */
    angular.module('ngTable', []);
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function () {
    /**
     * @ngdoc object
     * @name ngTableDefaultParams
     * @module ngTable
     * @description Default Parameters for ngTable
     */
    angular.module('ngTable')
        .value('ngTableDefaults', {
            params: {},
            settings: {}
        });
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    angular.module('ngTable')
        .factory('ngTableEventsChannel', ngTableEventsChannel);

    ngTableEventsChannel.$inject = ['$rootScope'];

    /**
     * @ngdoc service
     * @name ngTableEventsChannel
     * @description strongly typed pub/sub for `NgTableParams`
     *
     * Supported events:
     *
     * * afterCreated - raised when a new instance of `NgTableParams` has finished being constructed
     * * afterReloadData - raised when the `reload` event has finished loading new data
     * * datasetChanged - raised when `settings` receives a new data array
     * * pagesChanged - raised when a new pages array has been generated
     */
    function ngTableEventsChannel($rootScope){

        var events = {};
        events = addChangeEvent('afterCreated', events);
        events = addChangeEvent('afterReloadData', events);
        events = addChangeEvent('datasetChanged', events);
        events = addChangeEvent('pagesChanged', events);
        return events;

        //////////

        function addChangeEvent(eventName, target){
            var fnName = eventName.charAt(0).toUpperCase() + eventName.substring(1);
            var event = {};
            event['on' + fnName] = createEventSubscriptionFn(eventName);
            event['publish' + fnName] = createPublishEventFn(eventName);
            return angular.extend(target, event);
        }

        function createEventSubscriptionFn(eventName){

            return function subscription(handler/*[, eventSelector or $scope][, eventSelector]*/){
                var eventSelector = angular.identity;
                var scope = $rootScope;

                if (arguments.length === 2){
                    if (angular.isFunction(arguments[1].$new)) {
                        scope = arguments[1];
                    } else {
                        eventSelector = arguments[1]
                    }
                } else if (arguments.length > 2){
                    scope = arguments[1];
                    eventSelector = arguments[2];
                }

                // shorthand for subscriber to only receive events from a specific publisher instance
                if (angular.isObject(eventSelector)) {
                    var requiredPublisher = eventSelector;
                    eventSelector = function(publisher){
                        return publisher === requiredPublisher;
                    }
                }

                return scope.$on('ngTable:' + eventName, function(event, params/*, ...args*/){
                    // don't send events published by the internal NgTableParams created by ngTableController
                    if (params.isNullInstance) return;

                    var eventArgs = rest(arguments, 2);
                    var fnArgs = [params].concat(eventArgs);
                    if (eventSelector.apply(this, fnArgs)){
                        handler.apply(this, fnArgs);
                    }
                });
            }
        }

        function createPublishEventFn(eventName){
            return function publish(/*args*/){
                var fnArgs = ['ngTable:' + eventName].concat(Array.prototype.slice.call(arguments));
                $rootScope.$broadcast.apply($rootScope, fnArgs);
            }
        }

        function rest(array, n) {
            return Array.prototype.slice.call(array, n == null ? 1 : n);
        }
    }
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    angular.module('ngTable')
        .provider('ngTableFilterConfig', ngTableFilterConfigProvider);

    ngTableFilterConfigProvider.$inject = [];

    function ngTableFilterConfigProvider(){
        var config;
        var defaultConfig = {
            defaultBaseUrl: 'ng-table/filters/',
            defaultExt: '.html',
            aliasUrls: {}
        };

        this.$get = ngTableFilterConfig;
        this.resetConfigs = resetConfigs;
        this.setConfig = setConfig;

        init();

        /////////

        function init(){
            resetConfigs();
        }

        function resetConfigs(){
            config = defaultConfig;
        }

        function setConfig(customConfig){
            var mergeConfig = angular.extend({}, config, customConfig);
            mergeConfig.aliasUrls = angular.extend({}, config.aliasUrls, customConfig.aliasUrls);
            config = mergeConfig;
        }

        /////////

        ngTableFilterConfig.$inject = [];

        function ngTableFilterConfig(){

            var publicConfig;

            var service = {
                config: publicConfig,
                getTemplateUrl: getTemplateUrl,
                getUrlForAlias: getUrlForAlias
            };
            Object.defineProperty(service, "config", {
                get: function(){
                    return publicConfig = publicConfig || angular.copy(config);
                },
                enumerable: true
            });

            return service;

            /////////

            function getTemplateUrl(filterValue, filterKey){
                if (angular.isObject(filterValue)){
                    filterValue = filterValue.id;
                }
                if (filterValue.indexOf('/') !== -1){
                    return filterValue;
                }

                return service.getUrlForAlias(filterValue, filterKey);
            }

            function getUrlForAlias(aliasName/*, filterKey*/){
                return config.aliasUrls[aliasName] || config.defaultBaseUrl + aliasName + config.defaultExt;
            }
        }
    }
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';


    angular.module('ngTable')
        .provider('ngTableDefaultGetData', ngTableDefaultGetDataProvider);

    ngTableDefaultGetDataProvider.$inject = [];

    /**
     * @ngdoc provider
     * @name ngTableDefaultGetDataProvider
     * @description Allows for the configuration of the ngTableDefaultGetData service.
     *
     * Set filterFilterName to the name of a angular filter that knows how to take `NgTableParams.filter()`
     * to restrict an array of data.
     *
     * Set sortingFilterName to the name of a angular filter that knows how to take `NgTableParams.orderBy()`
     * to sort an array of data.
     *
     * Out of the box the `ngTableDefaultGetData` service will be configured to use the angular `filter` and `orderBy`
     * filters respectively
     */
    function ngTableDefaultGetDataProvider(){
        var provider = this;
        provider.$get = ngTableDefaultGetData;
        provider.filterFilterName = 'filter';
        provider.sortingFilterName = 'orderBy';

        ///////////

        ngTableDefaultGetData.$inject = ['$filter'];

        /**
         * @ngdoc service
         * @name ngTableDefaultGetData
         * @description A default implementation of the getData function that will apply the `filter`, `orderBy` and
         * paging values from the `NgTableParams` instance supplied to the data array supplied.
         *
         * The outcome will be to return the resulting array and to assign the total item count after filtering
         * to the `total` of the `NgTableParams` instance supplied
         */
        function ngTableDefaultGetData($filter) {

            return getData;

            function getFilterFn(params) {
                var settings = params.settings();
                if (angular.isFunction(settings.filterFn)){
                    return settings.filterFn;
                } else {
                    return $filter(settings.filterFilterName || provider.filterFilterName);
                }
            }

            function applyFilter(data, params) {
                var filter = params.filter(true);
                var filterKeys = Object.keys(filter);
                var parsedFilter = filterKeys.reduce(function(result, key){
                    result = setPath(result, filter[key], key);
                    return result;
                }, {});
                var filterFn = getFilterFn(params);
                return filterFn.call(params, data, parsedFilter, params.settings().filterComparator);
            }

            function getData(data, params) {
                if (data == null){
                    return [];
                }

                var fData = params.hasFilter() ? applyFilter(data, params) : data;
                var orderBy = params.orderBy();
                var orderedData = orderBy.length ? $filter(provider.sortingFilterName)(fData, orderBy) : fData;
                var pagedData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                params.total(orderedData.length); // set total for recalc pagination
                return pagedData;
            }

            // Sets the value at any depth in a nested object based on the path
            // note: adapted from: underscore-contrib#setPath
            function setPath(obj, value, path) {
                var keys     = path.split('.');
                var ret      = obj;
                var lastKey  = keys[keys.length -1];
                var target   = ret;

                var parentPathKeys = keys.slice(0, keys.length -1);
                parentPathKeys.forEach(function(key) {
                    if (!target.hasOwnProperty(key)) {
                        target[key] = {};
                    }
                    target = target[key];
                });

                target[lastKey] = value;
                return ret;
            }
        }
    }
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    // todo: remove shim after an acceptable depreciation period

    angular.module('ngTable')
        .factory('ngTableGetDataBcShim', ngTableGetDataBcShim);

    ngTableGetDataBcShim.$inject = ['$q'];

    function ngTableGetDataBcShim($q){

        return createWrapper;

        function createWrapper(getDataFn){
            return function getDataShim(/*args*/){
                var $defer = $q.defer();
                var pData = getDataFn.apply(this, [$defer].concat(Array.prototype.slice.call(arguments)));
                if (!pData) {
                    // If getData resolved the $defer, and didn't promise us data,
                    //   create a promise from the $defer. We need to return a promise.
                    pData = $defer.promise;
                }
                return pData;
            }
        }
    }
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function () {
    /**
     * @ngdoc service
     * @name ngTableColumn
     * @module ngTable
     * @description
     * Service to construct a $column definition used by {@link ngTable ngTable} directive
     */
    angular.module('ngTable').factory('ngTableColumn', [function () {

        var defaults = {
            'class': function(){ return ''; },
            filter: function(){ return false; },
            filterData: angular.noop,
            headerTemplateURL: function(){ return false; },
            headerTitle: function(){ return ''; },
            sortable: function(){ return false; },
            show: function(){ return true; },
            title: function(){ return ''; },
            titleAlt: function(){ return ''; }
        };

        /**
         * @ngdoc method
         * @name ngTableColumn#buildColumn
         * @description Creates a $column for use within a header template
         *
         * @param {Object} column an existing $column or simple column data object
         * @param {Scope} defaultScope the $scope to supply to the $column getter methods when not supplied by caller
         * @returns {Object} a $column object
         */
        function buildColumn(column, defaultScope){
            // note: we're not modifying the original column object. This helps to avoid unintended side affects
            var extendedCol = Object.create(column);
            for (var prop in defaults) {
                if (extendedCol[prop] === undefined) {
                    extendedCol[prop] = defaults[prop];
                }
                if(!angular.isFunction(extendedCol[prop])){
                    // wrap raw field values with "getter" functions
                    // - this is to ensure consistency with how ngTable.compile builds columns
                    // - note that the original column object is being "proxied"; this is important
                    //   as it ensure that any changes to the original object will be returned by the "getter"
                    (function(prop1){
                        extendedCol[prop1] = function(){
                            return column[prop1];
                        };
                    })(prop);
                }
                (function(prop1){
                    // satisfy the arguments expected by the function returned by parsedAttribute in the ngTable directive
                    var getterFn = extendedCol[prop1];
                    extendedCol[prop1] = function(){
                        if (arguments.length === 0){
                            return getterFn.call(column, defaultScope);
                        } else {
                            return getterFn.apply(column, arguments);
                        }
                    };
                })(prop);
            }
            return extendedCol;
        }

        return {
            buildColumn: buildColumn
        };
    }]);
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    /**
     * @ngdoc service
     * @name NgTableParams
     * @module ngTable
     * @description Parameters manager for ngTable
     */

    angular.module('ngTable').factory('NgTableParams', ['$q', '$log', 'ngTableDefaults', 'ngTableGetDataBcShim', 'ngTableDefaultGetData', 'ngTableEventsChannel', function($q, $log, ngTableDefaults, ngTableGetDataBcShim, ngTableDefaultGetData, ngTableEventsChannel) {
        var isNumber = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        var NgTableParams = function(baseParameters, baseSettings) {

            // the ngTableController "needs" to create a dummy/null instance and it's important to know whether an instance
            // is one of these
            if (typeof baseParameters === "boolean"){
                this.isNullInstance = true;
            }

            var self = this,
                committedParams,
                erroredParams,
                isCommittedDataset = false,
                log = function() {
                    if (settings.debugMode && $log.debug) {
                        $log.debug.apply(this, arguments);
                    }
                };

            this.data = [];
            this.selectedData = [];

            /**
             * @ngdoc method
             * @name NgTableParams#parameters
             * @description Set new parameters or get current parameters
             *
             * @param {string} newParameters      New parameters
             * @param {string} parseParamsFromUrl Flag if parse parameters like in url
             * @returns {Object} Current parameters or `this`
             */
            this.parameters = function(newParameters, parseParamsFromUrl) {
                parseParamsFromUrl = parseParamsFromUrl || false;
                if (angular.isDefined(newParameters)) {
                    for (var key in newParameters) {
                        var value = newParameters[key];
                        if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                            var keys = key.split(/\[(.*)\]/).reverse()
                            var lastKey = '';
                            for (var i = 0, len = keys.length; i < len; i++) {
                                var name = keys[i];
                                if (name !== '') {
                                    var v = value;
                                    value = {};
                                    value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                                }
                            }
                            if (lastKey === 'sorting') {
                                params[lastKey] = {};
                            }
                            params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                        } else {
                            params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                        }
                    }
                    log('ngTable: set parameters', params);
                    return this;
                }
                return params;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#settings
             * @description Set new settings for table
             *
             * @param {string} newSettings New settings or undefined
             * @returns {Object} Current settings or `this`
             */
            this.settings = function(newSettings) {
                if (angular.isDefined(newSettings)) {
                    if (angular.isArray(newSettings.data)) {
                        //auto-set the total from passed in data
                        newSettings.total = newSettings.data.length;
                    }

                    // todo: remove the backwards compatibility shim and the following two if blocks
                    if (newSettings.getData && newSettings.getData.length > 1){
                        // support the old getData($defer, params) api
                        newSettings.getDataFnAdaptor = ngTableGetDataBcShim;
                    }
                    if (newSettings.getGroups && newSettings.getGroups.length > 2){
                        // support the old getGroups($defer, params) api
                        newSettings.getGroupsFnAdaptor = ngTableGetDataBcShim;
                    }

                    var originalDataset = settings.data;
                    settings = angular.extend(settings, newSettings);

                    // note: using != as want null and undefined to be treated the same
                    var hasDatasetChanged = newSettings.hasOwnProperty('data') && (newSettings.data != originalDataset);
                    if (hasDatasetChanged) {
                        if (isCommittedDataset){
                            this.page(1); // reset page as a new dataset has been supplied
                        }
                        isCommittedDataset = false;
                        ngTableEventsChannel.publishDatasetChanged(this, newSettings.data, originalDataset);
                    }
                    log('ngTable: set settings', settings);
                    return this;
                }
                return settings;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#page
             * @description If parameter page not set return current page else set current page
             *
             * @param {string} page Page number
             * @returns {Object|Number} Current page or `this`
             */
            this.page = function(page) {
                return angular.isDefined(page) ? this.parameters({
                    'page': page
                }) : params.page;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#total
             * @description If parameter total not set return current quantity else set quantity
             *
             * @param {string} total Total quantity of items
             * @returns {Object|Number} Current page or `this`
             */
            this.total = function(total) {
                return angular.isDefined(total) ? this.settings({
                    'total': total
                }) : settings.total;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#count
             * @description If parameter count not set return current count per page else set count per page
             *
             * @param {string} count Count per number
             * @returns {Object|Number} Count per page or `this`
             */
            this.count = function(count) {
                // reset to first page because can be blank page
                return angular.isDefined(count) ? this.parameters({
                    'count': count,
                    'page': 1
                }) : params.count;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#filter
             * @description If 'filter' parameter not set return current filter else set current filter
             *
             * Note: when assigning a new filter, {@link NgTableParams#page page} will be set to 1
             *
             * @param {Object|Boolean} filter 'object': new filter to assign or
             * 'true': to return the current filter minus any insignificant values (null,  undefined and empty string); or
             * 'falsey': to return the current filter "as is"
             * @returns {Object} Current filter or `this`
             */
            this.filter = function(filter) {
                if (angular.isDefined(filter) && angular.isObject(filter)) {
                    return this.parameters({
                        'filter': filter,
                        'page': 1
                    });
                } else if (filter === true){
                    var keys = Object.keys(params.filter);
                    var significantFilter = {};
                    for (var i=0; i < keys.length; i++){
                        var filterValue = params.filter[keys[i]];
                        if (filterValue != null && filterValue !== '') {
                            significantFilter[keys[i]] = filterValue;
                        }
                    }
                    return significantFilter;
                } else {
                    return params.filter;
                }
            };

            /**
             * @ngdoc method
             * @name NgTableParams#sorting
             * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
             *
             * @param {string} sorting New sorting
             * @returns {Object} Current sorting or `this`
             */
            this.sorting = function(sorting) {
                if (arguments.length == 2) {
                    var sortArray = {};
                    sortArray[sorting] = arguments[1];
                    this.parameters({
                        'sorting': sortArray
                    });
                    return this;
                }
                return angular.isDefined(sorting) ? this.parameters({
                    'sorting': sorting
                }) : params.sorting;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#isSortBy
             * @description Checks sort field
             *
             * @param {string} field     Field name
             * @param {string} direction Optional direction of sorting ('asc' or 'desc')
             * @returns {Array} Return true if field sorted by direction
             */
            this.isSortBy = function(field, direction) {
                if(direction !== undefined) {
                    return angular.isDefined(params.sorting[field]) && params.sorting[field] == direction;
                } else {
                    return angular.isDefined(params.sorting[field]);
                }
            };

            /**
             * @ngdoc method
             * @name NgTableParams#orderBy
             * @description Return object of sorting parameters for angular filter
             *
             * @returns {Array} Array like: [ '-name', '+age' ]
             */
            this.orderBy = function() {
                var sorting = [];
                for (var column in params.sorting) {
                    sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
                }
                return sorting;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#generatePagesArray
             * @description Generate array of pages
             *
             * When no arguments supplied, the current parameter state of this `NgTableParams` instance will be used
             *
             * @param {boolean} currentPage which page must be active
             * @param {boolean} totalItems  Total quantity of items
             * @param {boolean} pageSize    Quantity of items on page
             * @param {number} maxBlocks    Quantity of blocks for pagination
             * @returns {Array} Array of pages
             */
            this.generatePagesArray = function(currentPage, totalItems, pageSize, maxBlocks) {
                if (!arguments.length){
                    currentPage = this.page();
                    totalItems = this.total();
                    pageSize = this.count();
                }

                var maxPage, maxPivotPages, minPage, numPages, pages;
                maxBlocks = maxBlocks && maxBlocks < 6 ? 6 : maxBlocks;

                pages = [];
                numPages = Math.ceil(totalItems / pageSize);
                if (numPages > 1) {
                    pages.push({
                        type: 'prev',
                        number: Math.max(1, currentPage - 1),
                        active: currentPage > 1
                    });
                    pages.push({
                        type: 'first',
                        number: 1,
                        active: currentPage > 1,
                        current: currentPage === 1
                    });
                    maxPivotPages = Math.round((settings.paginationMaxBlocks - settings.paginationMinBlocks) / 2);
                    minPage = Math.max(2, currentPage - maxPivotPages);
                    maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                    minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                    var i = minPage;
                    while (i <= maxPage) {
                        if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                            pages.push({
                                type: 'more',
                                active: false
                            });
                        } else {
                            pages.push({
                                type: 'page',
                                number: i,
                                active: currentPage !== i,
                                current: currentPage === i
                            });
                        }
                        i++;
                    }
                    pages.push({
                        type: 'last',
                        number: numPages,
                        active: currentPage !== numPages,
                        current: currentPage === numPages
                    });
                    pages.push({
                        type: 'next',
                        number: Math.min(numPages, currentPage + 1),
                        active: currentPage < numPages
                    });
                }
                return pages;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#isDataReloadRequired
             * @description Return true when a change to this `NgTableParams` instance should require the reload method
             * to be run so as to ensure the data presented to the user reflects the `NgTableParams`
             */
            this.isDataReloadRequired = function(){
                // note: using != as want to treat null and undefined the same
                return !isCommittedDataset || !angular.equals(params, committedParams) || hasGlobalSearchFieldChanges();
            };

            /**
             * @ngdoc method
             * @name NgTableParams#hasFilter
             * @description Determines if NgTableParams#filter has significant filter value(s)
             * (any value except null, undefined, or empty string)
             * @returns {Boolean} true when NgTableParams#filter has at least one significant field value
             */
            this.hasFilter = function(){
                return Object.keys(this.filter(true)).length > 0;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#hasFilterChanges
             * @description Return true when a change to `NgTableParams.filters`require the reload method
             * to be run so as to ensure the data presented to the user reflects these filters
             */
            this.hasFilterChanges = function(){
                return !angular.equals((params && params.filter), (committedParams && committedParams.filter)) ||
                    hasGlobalSearchFieldChanges();
            };

            function hasGlobalSearchFieldChanges(){
                var currentVal = (params && params.filter && params.filter.$);
                var previousVal = (committedParams && committedParams.filter && committedParams.filter.$);
                return !angular.equals(currentVal, previousVal);
            }

            /**
             * @ngdoc method
             * @name NgTableParams#url
             * @description Return groups for table grouping
             *
             * @param {boolean} asString flag indicates return array of string or object
             * @returns {Array} If asString = true will be return array of url string parameters else key-value object
             */
            this.url = function(asString) {
                asString = asString || false;
                var pairs = (asString ? [] : {});
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        var item = params[key],
                            name = encodeURIComponent(key);
                        if (typeof item === "object") {
                            for (var subkey in item) {
                                if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                    var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                    if (asString) {
                                        pairs.push(pname + "=" + item[subkey]);
                                    } else {
                                        pairs[pname] = item[subkey];
                                    }
                                }
                            }
                        } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                            if (asString) {
                                pairs.push(name + "=" + encodeURIComponent(item));
                            } else {
                                pairs[name] = encodeURIComponent(item);
                            }
                        }
                    }
                }
                return pairs;
            };

            /**
             * @ngdoc method
             * @name NgTableParams#reload
             * @description Reload table data
             */
            this.reload = function() {
                var self = this,
                    pData = null;

                settings.$loading = true;

                committedParams = angular.copy(params);
                isCommittedDataset = true;

                if (settings.groupBy) {
                    pData = runInterceptorPipeline(runGetGroups);
                } else {
                    pData = runInterceptorPipeline(runGetData);
                }

                log('ngTable: reload data');

                var oldData = self.data;
                return pData.then(function(data) {
                    settings.$loading = false;
                    erroredParams = null;

                    self.data = data;
                    // note: I think it makes sense to publish this event even when data === oldData
                    // subscribers can always set a filter to only receive the event when data !== oldData
                    ngTableEventsChannel.publishAfterReloadData(self, data, oldData);
                    self.reloadPages();

                    // todo: remove after acceptable depreciation period
                    if (settings.$scope) {
                        settings.$scope.$emit('ngTableAfterReloadData');
                    }

                    return data;
                }).catch(function(reason){
                    erroredParams = committedParams;
                    committedParams = null;
                    isCommittedDataset = false;
                    // "rethrow"
                    return $q.reject(reason);
                });
            };

            /**
             * @ngdoc method
             * @name NgTableParams#hasErrorState
             * @description Return true when an attempt to `reload` the current `parameter` values have resulted in
             * a failure
             *
             * This method will continue to return true until the reload is successfully called or when the
             * `parameter` values have changed
             */
            this.hasErrorState = function(){
                return !!(erroredParams && angular.equals(erroredParams, params));
            };

            this.reloadPages = (function() {
                var currentPages;
                return function(){
                    var oldPages = currentPages;
                    var newPages = self.generatePagesArray(self.page(), self.total(), self.count());
                    if (!angular.equals(oldPages, newPages)){
                        currentPages = newPages;
                        ngTableEventsChannel.publishPagesChanged(this, newPages, oldPages);
                    }
                }
            })();

            //  public function to get selected data at this time
            this.getSelectedData = function() {

              // return this.selectedData.map(function(item) {
              //   return item['$checked'] === true;
              // });
              
              return this.selectedData;
            };

            function runGetData(){
                var getDataFn = settings.getDataFnAdaptor(settings.getData);
                return $q.when(getDataFn.call(settings, self));
            }

            function runGetGroups(){
                var getGroupsFn = settings.getGroupsFnAdaptor(settings.getGroups);
                return $q.when(getGroupsFn.call(settings, self));
            }

            function runInterceptorPipeline(fetchFn){
                var interceptors = settings.interceptors || [];

                return interceptors.reduce(function(result, interceptor){
                    var thenFn = (interceptor.response && interceptor.response.bind(interceptor)) || $q.when;
                    var rejectFn = (interceptor.responseError && interceptor.responseError.bind(interceptor)) || $q.reject;
                    return result.then(function(data){
                        return thenFn(data, self);
                    }, function(reason){
                        return rejectFn(reason, self);
                    });
                }, fetchFn());
            }

            function getDefaultSettingFns(){

                return {
                    getDataFnAdaptor: angular.identity,
                    getGroupsFnAdaptor: angular.identity,
                    getData: getData,
                    getGroups: getGroups
                };

                /**
                 * @ngdoc method
                 * @name settings#getData
                 * @description Returns the data to display in the table
                 *
                 * Called by `NgTableParams` whenever it considers new data is to be loaded
                 *
                 * @param {Object} params the `NgTableParams` requesting data
                 */
                function getData(params) {
                    return ngTableDefaultGetData(params.settings().data, params);
                }

                /**
                 * @ngdoc method
                 * @name settings#getGroups
                 * @description Return groups of data to display in the table
                 *
                 * Called by `NgTableParams` whenever it considers new data is to be loaded
                 * and when the `settings` object has a `groupBy` value
                 *
                 * @param {Object} params the `NgTableParams` requesting data
                 */
                function getGroups(params) {
                    var settings = params.settings();
                    var adaptedFn = settings.getDataFnAdaptor(settings.getData);
                    var gotData = $q.when(adaptedFn.call(settings, params));
                    return gotData.then(function(data) {
                        var groups = {};
                        angular.forEach(data, function(item) {
                            var groupName;
                            if (angular.isFunction(settings.groupBy)) {
                                groupName = settings.groupBy(item);
                            } else {
                                groupName = item[settings.groupBy];
                            }

                            groups[groupName] = groups[groupName] || {
                                    data: []
                                };
                            groups[groupName]['value'] = groupName;
                            groups[groupName].data.push(item);
                        });
                        var result = [];
                        for (var i in groups) {
                            result.push(groups[i]);
                        }
                        return result;
                    });
                }
            }

            var params = {
                page: 1,
                count: 10,
                filter: {},
                sorting: {},
                group: {},
                groupBy: null
            };
            angular.extend(params, ngTableDefaults.params);

            /**
             * @ngdoc object
             * @name settings
             * @module ngTable
             * @description configuration settings for `NgTableParams`
             */
            var settings = {
                // todo: remove $scope after acceptable depreciation period as no longer required
                $scope: null, // set by ngTable controller
                $loading: false,
                data: null, //allows data to be set when table is initialized
                total: 0,
                defaultSort: 'desc',
                filterComparator: undefined, // look for a substring match in case insensitive way
                filterDelay: 750,
                filterFilterName: undefined, // when defined overrides ngTableDefaultGetDataProvider.filterFilterName
                filterFn: undefined, // when defined overrides the filter function that ngTableDefaultGetData uses
                filterLayout: 'stack', // alternative: 'horizontal'
                // counts: [10, 25, 50, 100],
                counts: [],     // not to show page count control by default
                interceptors: [],
                paginationMaxBlocks: 11,
                paginationMinBlocks: 5,
                sortingIndicator: 'span'
            };

            this.settings(getDefaultSettingFns());
            this.settings(ngTableDefaults.settings);
            this.settings(baseSettings);
            this.parameters(baseParameters, true);

            ngTableEventsChannel.publishAfterCreated(this);

            return this;
        };
        return NgTableParams;
    }]);

    /**
     * @ngdoc service
     * @name ngTableParams
     * @description Backwards compatible shim for lowercase 'n' in NgTableParams
     */
    angular.module('ngTable').factory('ngTableParams', ['NgTableParams', function(NgTableParams) {
        return NgTableParams;
    }]);
})();



/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    /**
     * @ngdoc object
     * @name ngTableController
     *
     * @description
     * Each {@link ngTable ngTable} directive creates an instance of `ngTableController`
     */
    angular.module('ngTable').controller('ngTableController', ['$scope', 'NgTableParams', '$timeout', '$parse', '$compile', '$attrs', '$element',
        'ngTableColumn', 'ngTableEventsChannel', 'arrayUtilService', 
        function($scope, NgTableParams, $timeout, $parse, $compile, $attrs, $element, ngTableColumn, ngTableEventsChannel, arrayUtilService) {
            var isFirstTimeLoad = true;
            $scope.$filterRow = {};
            $scope.$loading = false;
            
//            $scope.$watch('filterOptions', function(newVal, oldVal) {
//              console.log('in watch111-->', newVal);
//            }, true);

            var vm = $scope.vm = {};
            // trig search function
            // $scope.searchTrigger = function(e) {
            //     console.log($scope);
            //     $scope.params.reload();
            // };

            $scope.$watch('vm.searchKey', function(newVal, oldVal) {
                if(angular.isDefined(newVal)) {
                    $scope.params.reload();
                }              
            })

            // controlParams to store some parameters for ng-table control, show etc.
            // @20150826
            $scope.controlParams = {
                'isShowSearch': false,
                'noDataTip': '没有对应的数据！'
            };
            angular.extend($scope.controlParams, $scope.$eval($attrs.ngTable).parameters());
            $scope.controlParams.isShowCheckbox = angular.isDefined($scope.controlParams.isMultiSel) ? true : false;

            // 
            // $scope.allDataChecked = function() {

            //   if($scope.$data) {
            //     vm.isAllSelected = arrayUtilService.isAllSelected($scope.$data, $checked);
            //   }
            // }

            // $scope.allDataChecked();

            // thead > tr > th checkbox click function: select all
            $scope.thCheckboxClick = function(e, datas) {
              // e.preventDefault();

              var isAllSelected = arrayUtilService.isAllSelected(datas, '$checked');

              if(isAllSelected) {
                datas = arrayUtilService.unSelectedAll(datas, '$checked');
                $scope.params.selectedData = [];
                vm.isAllSelected = false;
              } else {
                datas = arrayUtilService.selectedAll(datas, '$checked');
                $scope.params.selectedData = datas;
                vm.isAllSelected = true;
              }

              e.stopPropagation();
            };

            // tbody > tr > td checkbox click function: select a row
            $scope.rowCheckboxClick = function(e, item) {
              e.preventDefault();

              item.$checked = !item.$checked;

              vm.isAllSelected = arrayUtilService.isAllSelected($scope.$data, '$checked');

              e.stopPropagation();
            };
            
            vm.isAllSelected = arrayUtilService.isAllSelected($scope.$data, '$checked');

            // until such times as the directive uses an isolated scope, we need to ensure that the check for
            // the params field only consults the "own properties" of the $scope. This is to avoid seeing the params
            // field on a $scope higher up in the prototype chain
            if (!$scope.hasOwnProperty("params")) {
                $scope.params = new NgTableParams(true);
            }
            $scope.params.settings().$scope = $scope;

            var delayFilter = (function() {
                var timer = 0;
                return function(callback, ms) {
                    $timeout.cancel(timer);
                    timer = $timeout(callback, ms);
                };
            })();

            function onDataReloadStatusChange (newStatus/*, oldStatus*/) {
                if (!newStatus || $scope.params.hasErrorState()) {
                    return;
                }

                $scope.params.settings().$scope = $scope;

                var currentParams = $scope.params;

                if (currentParams.hasFilterChanges()) {
                    var applyFilter = function () {
                        currentParams.page(1);
                        currentParams.reload();
                    };
                    if (currentParams.settings().filterDelay) {
                        delayFilter(applyFilter, currentParams.settings().filterDelay);
                    } else {
                        applyFilter();
                    }
                } else {
                    currentParams.reload();
                }
            }

            // watch for when a new NgTableParams is bound to the scope
            // CRITICAL: the watch must be for reference and NOT value equality; this is because NgTableParams maintains
            // the current data page as a field. Checking this for value equality would be terrible for performance
            // and potentially cause an error if the items in that array has circular references
            $scope.$watch('params', function(newParams, oldParams){
                if (newParams === oldParams || !newParams) {
                    return;
                }

                newParams.reload();
            }, false);

            var generateRow = function(columns, value) {
              var iLen = vm.columns.length; 
              var arr = [];
              for(var i=0; i<iLen; i++) {
                var $td = angular.element(vm.columns[i]);
                if($td.hasClass('collapsed-sm')) {
                  arr.push('<div class="collapse-info"><span class="collapse-name">' + vm.columnsTitle[i] + 
                    '</span><span class="collapse-value" ng-bind="item.duty">' + (vm.columns[i].duty || '') + '</span></div>');
                }
              }

              return '<td colspan="6">' + arr.join('') + '</td>';
            };

            var getCols = function() {
              // all columns titles
              vm.columnsTitle = [];
              for(var i=0; i<$scope.$columns.length; i++) {
                vm.columnsTitle.push($scope.$columns[i].title());
              }
              // all columns info
              var $tds = $element.find('tbody > tr:first').find('td');
              if(!$scope.controlParams.isShowCheckbox) {
                $tds.shift(0);
              }
              vm.columns = $tds;
            };

            $scope.clickRow = function(row, index) {
              row.$collapsed = !row.$collapsed;
              console.log(row);
            }

            // operation after ng-repeat finished:starts
            $scope.$on('ngTableNgRepeatFinished', function(event, data) {
              console.info('In ngTableNgRepeatFinished: abandoned!');
              /*
              var $trs = $element.find('tbody > tr:not(.ng-table-no-data-tip)');

              // child trs exists, remove and rebuild child trs
              var $childs = $element.find('tbody > tr.child');
              if($childs.length > 0) {
                $childs.remove();
                // return false;
              }

              getCols();

              for(var i=0; i<$trs.length; i++) {
                var $this = angular.element($trs[i]);
                var value = $scope.$data[i];

                $this.addClass('parent');

                var $tr = angular.element(document.createElement('tr')).addClass('child');
                var str = generateRow($this, value);
                $tr.html(str);
                 
                // var $tr = $this.clone();
                $tr.insertAfter($this);

                $compile($tr)($scope);
              }
              */
            });
            // operation after ng-repeat finished:ends

            $scope.$watch('params.isDataReloadRequired()', onDataReloadStatusChange);

            var getCorrespondClass = function(collapseType) {
              var correspondClass = '';
              switch(collapseType) {
                case 'collapsed':
                  correspondClass = '';
                  break;
                case 'collapsed-md':
                  correspondClass = '';
                  break;
                case 'collapsed-sm': 
                  correspondClass = 'hidden-md hidden-lg';
                  break;
                case 'collapsed-xs': 
                  correspondClass = 'hidden-sm hidden-md hidden-lg';
                  break;
              }

              return correspondClass;
            };

            var colManage = function($td) {
              if($td.hasClass('collapsed-md')) {
                $td.addClass(getCorrespondClass('collapsed-md'));
              } else if($td.hasClass('collapsed-sm')) {
                $td.addClass(getCorrespondClass('collapsed-sm'));
              } else if($td.hasClass('collapsed-xs')) {
                $td.addClass(getCorrespondClass('collapsed-xs'));
              }

              return $td;
            };

            var generateExpandHtml = function($tds) {
              var iLen = $tds.length,
                  $td = null,
                  arr = [],
                  str = '',
                  className = '',
                  $tdClass = '',
                  index = 0;

              for(var i=0; i<iLen; i++) {
                $td = angular.element($tds[i]);
                $tdClass = $td.attr('class');
                if(angular.isUndefined($tdClass)) {
                  continue;
                }
                if($tdClass.indexOf('collapsed') > -1 && $tdClass.indexOf('collapsed-') < 0) {
                  className = 'hidden-md';
                } else if($tdClass.indexOf('collapsed-xs') > -1) {
                  className = 'hidden-sm hidden-md hidden-lg';
                } else if($tdClass.indexOf('collapsed-sm') > -1) {
                  className = 'hidden-md hidden-lg';
                } else if($tdClass.indexOf('collapsed-md') > -1) {
                  className = 'hidden-lg';
                } else if($tdClass.indexOf('collapsed-lg') > -1) {
                  className = '';
                } else {
                  continue;
                }

                if(i == 0 && $td.hasClass('td-select')) {
                  index = 1;
                }

                arr.push({
                  // 'name': $td.attr('data-title'),
                  'name': $scope.$columns[i - index].title(),
                  'value': $td.attr('ng-bind'),
                  'className': className
                });
              }

              for(var i=0; i<arr.length; i++) {
                if(i == 0) {
                  str += '<div class="padder-v-table"><div class="hbox ' + arr[i]['className'] + '"><div class="col col-bar collapse-name">' + arr[i]['name'] + '</div>' 
                      + '<div class="col collapse-value" ng-bind="' + arr[i]['value'] + '"></div></div></div>';
                } else {
                  str += '<div class="padder-v-table ng-table-b-t"><div class="hbox  ' + arr[i]['className'] + '"><div class="col col-bar collapse-name">' + arr[i]['name'] + '</div>' 
                      + '<div class="col collapse-value" ng-bind="' + arr[i]['value'] + '"></div></div></div>';
                }
              }

              return str;
            };

            this.compileDirectiveTemplates = function () {

                if (!$element.hasClass('ng-table conow-grid')) {
                    $scope.templates = {
                        search: 'ng-table/search.html',
                        header: ($attrs.templateHeader ? $attrs.templateHeader : 'ng-table/header.html'),
                        pagination: ($attrs.templatePagination ? $attrs.templatePagination : 'ng-table/pager.html'),
                        noDataTip: 'ng-table/noDataTip.html'
                    };
                    $element.addClass('ng-table conow-grid');

                    // $element.wrap('<div class="ng-table-container" width="500"></div>');

                    var $tr = $element.find('tbody > tr:not(".no-repeat")'); 
                    var $tds = $tr.find('td');
                    var html = generateExpandHtml($tds);         

                    // compile tr-parent and tr-child for expanding: starts
                    var $trChild = angular.element(document.createElement('tr')).addClass('child ng-table-childHidden');
                    $tr.after($trChild);

                    $tr.addClass('parent')
                      .attr('ng-repeat-start', 'item in $data track by $index')
                      .attr('ng-click', 'clickRow(item, $index)');
                    $trChild.attr('ng-repeat-end', '')
                      .attr('ng-class', '{"row-collapsed": !item.$collapsed}')
                      .html('<td colspan="' + $tds.length + '">' + html + '</td>');

                    $compile($tr)($scope);
                    $compile($trChild)($scope);
                    // compile tr-parent and tr-child for expanding: ends

                    // shows search row: starts
                    if($scope.controlParams.isShowSearch) {
                      var searchTemplate = angular.element(document.createElement('div'))
                        .attr('ng-include', 'templates.search')
                        // .attr('ng-table-search', 'params')
                        .addClass('ng-table-search');
                      $element.parent().prepend(searchTemplate);
                      $compile(searchTemplate)($scope);
                    }
                    // shows search row: ends

                    var headerTemplate = null;

                    // $element.find('> thead').length === 0 doesn't work on jqlite
                    var theadFound = false;
                    angular.forEach($element.children(), function(e) {
                        if (e.tagName === 'THEAD') {
                            theadFound = true;
                        }
                    });
                    if (!theadFound) {
                        headerTemplate = angular.element(document.createElement('thead')).attr('ng-include', 'templates.header');
                        $element.prepend(headerTemplate);
                    }
                    // var paginationTemplate = angular.element(document.createElement('div')).attr({
                    //     'ng-table-pagination': 'params',
                    //     'template-url': 'templates.pagination','attr1': 'params'
                    // });
                    //                 
                    var paginationTemplate = angular.element(document.createElement('div')).attr({
                        'conow-pagination': 'params.paginationParams',
                        'ng-if': 'params.settings().$loading === false'
                    });

                    $element.after(paginationTemplate);
                    if (headerTemplate) {
                        $compile(headerTemplate)($scope);
                    }
                    $compile(paginationTemplate)($scope);

                    // shows message when there is no data: starts                   
                    var noDataTipTemplate = angular.element(document.createElement('tr')).attr('ng-include', 'templates.noDataTip').addClass('ng-table-no-data-tip');
                    $element.find('tbody').append(noDataTipTemplate);
                    $compile(noDataTipTemplate)($scope);
                    // shows message when there is no data: ends

                    if($element.hasClass('horizontal-scroll')) {
                        $element.wrap('<div class="ng-table-container"></div>') ;
                    }                    
                }
            };

            this.loadFilterData = function ($columns) {
                angular.forEach($columns, function ($column) {
                    var result;
                    result = $column.filterData($scope, {
                        $column: $column
                    });
                    if (!result) {
                        delete $column.filterData;
                        return;
                    }

                    // if we're working with a deferred object or a promise, let's wait for the promise
                    /* WARNING: support for returning a $defer is depreciated */
                    if ((angular.isObject(result) && (angular.isObject(result.promise) || angular.isFunction(result.then)))) {
                        var pData = angular.isFunction(result.then) ? result : result.promise;
                        delete $column.filterData;
                        return pData.then(function(data) {
                            // our deferred can eventually return arrays, functions and objects
                            if (!angular.isArray(data) && !angular.isFunction(data) && !angular.isObject(data)) {
                                // if none of the above was found - we just want an empty array
                                data = [];
                            }
                            $column.data = data;
                        });
                    }
                    // otherwise, we just return what the user gave us. It could be a function, array, object, whatever
                    else {
                        return $column.data = result;
                    }
                });
            };

            this.buildColumns = function (columns) {
                return columns.map(function(col){
                    return ngTableColumn.buildColumn(col, $scope)
                })
            };

            this.parseNgTableDynamicExpr = function (attr) {
                if (!attr || attr.indexOf(" with ") > -1) {
                    var parts = attr.split(/\s+with\s+/);
                    return {
                        tableParams: parts[0],
                        columns: parts[1]
                    };
                } else {
                    throw new Error('Parse error (expected example: ng-table-dynamic=\'tableParams with cols\')');
                }
            };

            this.setupBindingsToInternalScope = function(tableParamsExpr){

                // note: this we're setting up watches to simulate angular's isolated scope bindings

                // note: is REALLY important to watch for a change to the ngTableParams *reference* rather than
                // $watch for value equivalence. This is because ngTableParams references the current page of data as
                // a field and it's important not to watch this
                var tableParamsGetter = $parse(tableParamsExpr);
                $scope.$watch(tableParamsGetter, (function (params) {
                    if (angular.isUndefined(params)) {
                        return;
                    }
                    $scope.paramsModel = tableParamsGetter;
                    $scope.params = params;
                }), false);

                $scope.$watch('params', function(newVal, oldVal) {
                    if(angular.isUndefined($scope.params.paginationParams)) {
                        $scope.params.paginationParams = {
                            page: 1,
                            pagesize: 10,
                            totalItems: 0
                        };
                    }
                    if(angular.isDefined(newVal)) {
                        $scope.params.paginationParams.onChangeFn = function(pageInfo) {
                            $scope.params.paginationParams.page = pageInfo.page;
                            $scope.params.paginationParams.currentPage = pageInfo.page;
                            newVal.page(pageInfo.page);
                        };
                        $scope.params.paginationParams.pagesize = newVal.parameters().count;
                        $scope.params.paginationParams.pageSize = newVal.parameters().count;
                        $scope.params.paginationParams.totalItems = newVal.total();
                    }
                }, true);

                if ($attrs.showFilter) {
                    $scope.$parent.$watch($attrs.showFilter, function(value) {
                        $scope.show_filter = value;
                    });
                }
                if ($attrs.disableFilter) {
                    $scope.$parent.$watch($attrs.disableFilter, function(value) {
                        $scope.$filterRow.disabled = value;
                    });
                }
            };



            function commonInit(){
                ngTableEventsChannel.onAfterReloadData(bindDataToScope, $scope, isMyPublisher);
                ngTableEventsChannel.onPagesChanged(bindPagesToScope, $scope, isMyPublisher);

                function bindDataToScope(params, newDatapage){
                    if (params.settings().groupBy) {
                        $scope.$groups = newDatapage;
                    } else {
                        $scope.$data = newDatapage;
                    }
                }

                function bindPagesToScope(params, newPages){
                    $scope.pages = newPages
                }

                function isMyPublisher(publisher){
                    return $scope.params === publisher;
                }
            }

            commonInit();
        }]);
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    /**
     * @ngdoc directive
     * @name ngTable
     * @module ngTable
     * @restrict A
     *
     * @description
     * Directive that instantiates {@link ngTableController ngTableController}.
     */
    angular.module('ngTable').directive('ngTable', ['$q', '$parse', '$timeout', '$rootScope', 
        function($q, $parse, $timeout, $rootScope) {
            'use strict';

            return {
                restrict: 'A',
                priority: 1001,
                scope: true,
                controller: 'ngTableController',
                compile: function(element, attrs) {
                    var columns = [],
                        i = 0,
                        row = null;

                    var $scope = $rootScope.$new();

                    // IE 8 fix :not(.ng-table-group) selector
                    angular.forEach(angular.element(element.find('tr')), function(tr) {
                        tr = angular.element(tr);
                        if (!tr.hasClass('ng-table-group') && !row) {
                            row = tr;
                        }
                    });
                    if (!row) {
                        return;
                    }

                    // manage td for hidden,collapse: starts
                    // 
                    // get corresponding class according to collapseType
                    var getCorrespondClass = function(collapseType) {
                      var correspondClass = '';
                      switch(collapseType) {
                        case 'collapsed':
                          correspondClass = 'hidden hidden-md hidden-sm hidden-xs';
                          break;
                        case 'collapsed-md':
                          correspondClass = 'hidden-md hidden-sm hidden-xs';
                          break;
                        case 'collapsed-sm': 
                          correspondClass = 'hidden-sm hidden-xs';
                          break;
                        case 'collapsed-xs': 
                          correspondClass = 'hidden-xs';
                          break;
                      }

                      return correspondClass;
                    };

                    var colManage = function(col) {
                      var className = '';

                      if(col.hasClass('collapsed')) {
                        className = getCorrespondClass('collapsed')

                        col.addClass(className);
                        col.attr('header-class', "'" + className + "'");
                      } else if(col.hasClass('collapsed-md')) {
                        className = getCorrespondClass('collapsed-md');

                        col.addClass(className);
                        col.attr('header-class', "'" + className + "'");
                      } else if(col.hasClass('collapsed-sm')) {
                        className = getCorrespondClass('collapsed-sm');

                        col.addClass(className);
                        col.attr('header-class', "'" + className + "'");
                      } else if(col.hasClass('collapsed-xs')) {
                        className = getCorrespondClass('collapsed-xs');

                        col.addClass(className);
                        col.attr('header-class', "'" + className + "'");
                      }

                      return col;
                    };

                    var $tds = row.find('td');
                    var $td = null;
                    for(var i=0; i<$tds.length; i++) {
                      $tds[i] = colManage(angular.element($tds[i]));
                    }
                    //
                    // manage td for hidden,collapse: ends

                    // generate select checkbox:starts
                    var $tdSelCheckboxs = angular.element(document.createElement('td'))
                      .attr('ng-show', 'controlParams.isShowCheckbox')
                      .attr('width', '30')
                      .attr('header-class', "'th-select'")
                      .attr('header', "'ng-table/headerCheckbox.html'")
                      .attr('ng-click', 'rowCheckboxClick($event, item)')
                      .addClass('td-select')
                      .html('<label class="i-checks"><input type="checkbox" class="row-checkbox" ng-checked="item.$checked"/><i></i></label>');

                    row.prepend($tdSelCheckboxs);
                    // generate select checkbox:ends

                    angular.forEach(row.find('td'), function(item) {
                        var el = angular.element(item);
                        if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                            return;
                        }

                        var getAttrValue = function(attr){
                            return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                        };

                        var parsedAttribute = function(attr) {
                            var expr = getAttrValue(attr);
                            if (!expr){
                                return undefined;
                            }
                            return function(scope, locals) {
                                return $parse(expr)(scope, angular.extend(locals || {}, {
                                    $columns: columns
                                }));
                            };
                        };

                        var titleExpr = getAttrValue('title-alt') || getAttrValue('title');
                        if (titleExpr){
                            el.attr('data-title-text', '{{' + titleExpr + '}}'); // this used in responsive table
                        }
                        // NOTE TO MAINTAINERS: if you add extra fields to a $column be sure to extend ngTableColumn with
                        // a corresponding "safe" default
                        columns.push({
                            id: i++,
                            title: parsedAttribute('title'),
                            titleAlt: parsedAttribute('title-alt'),
                            headerTitle: parsedAttribute('header-title'),
                            sortable: parsedAttribute('sortable'),
                            'class': parsedAttribute('header-class'),
                            filter: parsedAttribute('filter'),
                            headerTemplateURL: parsedAttribute('header'),
                            filterData: parsedAttribute('filter-data'),
                            show: (el.attr("ng-if") ? function (scope) {
                                return $parse(el.attr("ng-if"))(scope);
                            } : undefined)
                        });
                    });
                    return function(scope, element, attrs, controller) {
                        scope.$columns = columns = controller.buildColumns(columns);

                        if(!scope.controlParams.isShowCheckbox) {
                          scope.$columns.shift(0);
                        }

                        controller.setupBindingsToInternalScope(attrs.ngTable);
                        controller.loadFilterData(columns);
                        controller.compileDirectiveTemplates();
                    };
                }
            }
        }
    ]);
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){

    /**
     * @ngdoc directive
     * @name ngTableDynamic
     * @module ngTable
     * @restrict A
     *
     * @description
     * A dynamic version of the {@link ngTable ngTable} directive that accepts a dynamic list of columns
     * definitions to render
     */
    angular.module('ngTable').directive('ngTableDynamic', ['$parse', function ($parse){

        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: 'ngTableController',
            compile: function(tElement) {
                var row;

                // IE 8 fix :not(.ng-table-group) selector
                angular.forEach(angular.element(tElement.find('tr')), function(tr) {
                    tr = angular.element(tr);
                    if (!tr.hasClass('ng-table-group') && !row) {
                        row = tr;
                    }
                });
                if (!row) {
                    return;
                }

                angular.forEach(row.find('td'), function(item) {
                    var el = angular.element(item);
                    var getAttrValue = function(attr){
                        return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                    };

                    // this used in responsive table
                    var titleExpr = getAttrValue('title');
                    if (!titleExpr){
                        el.attr('data-title-text', '{{$columns[$index].titleAlt(this) || $columns[$index].title(this)}}');
                    }
                    var showExpr = el.attr('ng-if');
                    if (!showExpr){
                        el.attr('ng-if', '$columns[$index].show(this)');
                    }
                });
                return function (scope, element, attrs, controller) {
                    var expr = controller.parseNgTableDynamicExpr(attrs.ngTableDynamic);

                    controller.setupBindingsToInternalScope(expr.tableParams);
                    controller.compileDirectiveTemplates();

                    scope.$watchCollection(expr.columns, function (newCols/*, oldCols*/) {
                        scope.$columns = controller.buildColumns(newCols);
                        controller.loadFilterData(scope.$columns);
                    });
                };
            }
        };
    }]);
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    /**
     * @ngdoc directive
     * @name ngTablePagination
     * @module ngTable
     * @restrict A
     */
    angular.module('ngTable').directive('ngTablePagination', ['$compile', 'ngTableEventsChannel',
        function($compile, ngTableEventsChannel) {
            'use strict';

            return {
                restrict: 'A',
                scope: {
                    'params': '=ngTablePagination',
                    'templateUrl': '='
                },
                replace: false,
                link: function(scope, element/*, attrs*/) {

                    ngTableEventsChannel.onAfterReloadData(function(pubParams) {
                        scope.pages = pubParams.generatePagesArray();
                    }, scope, function(pubParams){
                        return pubParams === scope.params;
                    });

                    scope.$watch('templateUrl', function(templateUrl) {
                        if (angular.isUndefined(templateUrl)) {
                            return;
                        }
                        var template = angular.element(document.createElement('div'));
                        template.attr({
                            'ng-include': 'templateUrl'
                        });
                        element.append(template);
                        $compile(template)(scope);
                    });
                }
            };
        }
    ]);

})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    angular.module('ngTable')
        .controller('ngTableFilterRowController', ngTableFilterRowController);

    ngTableFilterRowController.$inject = ['$scope', 'ngTableFilterConfig'];

    function ngTableFilterRowController($scope, ngTableFilterConfig){

        $scope.config = ngTableFilterConfig;

        $scope.getFilterCellCss = function (filter, layout){
            if (layout !== 'horizontal') {
                return 's12';
            }

            var size = Object.keys(filter).length;
            var width = parseInt(12 / size, 10);
            return 's' + width;
        };

        $scope.getFilterPlaceholderValue = function(filterValue/*, filterName*/){
            if (angular.isObject(filterValue)) {
                return filterValue.placeholder;
            } else {
                return '';
            }
        };
    }
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    angular.module('ngTable')
        .directive('ngTableFilterRow', ngTableFilterRow);

    ngTableFilterRow.$inject = [];

    function ngTableFilterRow(){
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'ng-table/filterRow.html',
            scope: true,
            controller: 'ngTableFilterRowController'
        };
        return directive;
    }
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    angular.module('ngTable')
        .controller('ngTableSorterRowController', ngTableSorterRowController);

    ngTableSorterRowController.$inject = ['$scope'];

    function ngTableSorterRowController($scope){

        $scope.sortBy = sortBy;

        ///////////

        function sortBy($column, event) {
            var parsedSortable = $column.sortable && $column.sortable();
            if (!parsedSortable) {
                return;
            }
            var defaultSort = $scope.params.settings().defaultSort;
            var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
            var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
            var sortingParams = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            $scope.params.parameters({
                sorting: sortingParams
            });
        }
    }
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    angular.module('ngTable')
        .directive('ngTableSorterRow', ngTableSorterRow);

    ngTableSorterRow.$inject = [];

    function ngTableSorterRow(){
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'ng-table/sorterRow.html',
            scope: true,
            controller: 'ngTableSorterRowController'
        };
        return directive;
    }
})();

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name ngTableSelectFilterDs
     * @module ngTable
     * @restrict A
     *
     * @description
     * Takes the array returned by $column.filterData and makes it available as `$selectData` on the `$scope`.
     *
     * The resulting `$selectData` array will contain an extra item that is suitable to represent the user
     * "deselecting" an item from a `<select>` tag
     *
     * This directive is is focused on providing a datasource to an `ngOptions` directive
     */
    angular.module('ngTable')
        .directive('ngTableSelectFilterDs', ngTableSelectFilterDs);

    ngTableSelectFilterDs.$inject = [];

    function ngTableSelectFilterDs(){
        // note: not using isolated or child scope "by design"
        // this is to allow this directive to be combined with other directives that do

        var directive = {
            restrict: 'A',
            controller: ngTableSelectFilterDsController
        };
        return directive;
    }

    ngTableSelectFilterDsController.$inject = ['$scope', '$parse', '$attrs', '$q'];
    function ngTableSelectFilterDsController($scope, $parse, $attrs, $q){

        init();

        function init(){
            var $column = $parse($attrs.ngTableSelectFilterDs)($scope);
            getSelectListData($column).then(function(data){
                if (data && !hasEmptyOption(data)){
                    data.unshift({ id: '', title: ''});
                }
                data = data || [];
                $scope.$selectData = data;
            });
        }

        function hasEmptyOption(data) {
            var isMatch;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item && item.id === '') {
                    isMatch = true;
                    break;
                }
            }
            return isMatch;
        }

        function getSelectListData($column) {
            var data = angular.isFunction($column.data) ? $column.data() : $column.data;
            return $q.when(data);
        }
    }
})();

(function() {
  angular.module('ngTable')
    .directive('expandRow', ['$timeout', function($timeout) {
      return {
        restrict: 'AE',
        compile: function(elem, attrs) {

          return function(scope, elem, attrs) {
            if(scope.$last === true) {
              scope.$emit('ngTableNgRepeatFinished', {'from': 'expandRow link'});
            }

          };
        }
      }
    }]);
})();

// (function() {
//   angular.module('ngTable')
//     .directive('ngTableSearch', [function() {
//       return {
//         restrict: 'AE',
//         scope: {
//           vm: '=ngTableSearch',
//         },
//         link: function(scope, elem, attrs) {
//           vm.searchKey = 'abc';

//           // search trigger function
//           scope.searchTrigger = function(e) {
//             e.preventDefault();

//             e.stopPropagation();
//           }
//         }
//       }
//     }]);
// })();

/**
 * array util service:array operations
 * @return {[type]} [description]
 */
(function() {
  angular.module('ngTable')
    .service('arrayUtilService', [
      function(){
        var arrayUtil = {
          isAllSelected: function(arr, selectedKey) {
            if(!angular.isArray(arr)) {
              return false;
            }

            var iLen = arr.length;
            var selectedVal;
            for(var i=0; i<iLen; i++) {
              selectedVal = arr[i][selectedKey];
              if(angular.isUndefined(selectedVal) || !angular.equals(selectedVal, true)) {
                return false;
              }
            }

            return true;
          },
          selectedAll: function(arr, selectedKey) {
            if(!angular.isArray(arr)) {
              return false;
            }

            var iLen = arr.length;
            for(var i=0; i<iLen; i++) {
              arr[i][selectedKey] = true;
            }

            return arr;
          },
          unSelectedAll: function(arr, selectedKey){
            if(!angular.isArray(arr)) {
              return false;
            }

            var iLen = arr.length;
            for(var i=0; i<iLen; i++) {
              arr[i][selectedKey] = false;
            }

            return arr;
          }
        };

        return arrayUtil;
      }
    ])
})();

angular.module('ngTable').run(['$templateCache', function ($templateCache) {
  $templateCache.put('ng-table/filterRow.html', '<tr ng-show="show_filter" class="ng-table-filters"> <th data-title-text="{{$column.titleAlt(this) || $column.title(this)}}" ng-repeat="$column in $columns" ng-if="$column.show(this)" class="filter" ng-class="params.settings().filterLayout===\'horizontal\' ? \'filter-horizontal\' : \'\'"> <div ng-repeat="(name, filter) in $column.filter(this)" ng-include="config.getTemplateUrl(filter)" class="filter-cell" ng-class="[getFilterCellCss($column.filter(this), params.settings().filterLayout), $last ? \'last\' : \'\']"> </div> </th> </tr> ');
  $templateCache.put('ng-table/filters/number.html', '<input type="number" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="input-filter form-control" placeholder="{{getFilterPlaceholderValue(filter, name)}}"/> ');
  $templateCache.put('ng-table/filters/select-multiple.html', '<select ng-options="data.id as data.title for data in $column.data" ng-disabled="$filterRow.disabled" multiple ng-multiple="true" ng-model="params.filter()[name]" class="filter filter-select-multiple form-control" name="{{name}}"> </select> ');
  $templateCache.put('ng-table/filters/select.html', '<select ng-options="data.id as data.title for data in $selectData" ng-table-select-filter-ds="$column" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="filter filter-select form-control" name="{{name}}"> <option style="display:none" value=""></option> </select> ');
  $templateCache.put('ng-table/filters/text.html', '<input type="text" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="input-filter form-control" placeholder="{{getFilterPlaceholderValue(filter, name)}}"/> ');
  $templateCache.put('ng-table/header.html', '<ng-table-sorter-row></ng-table-sorter-row> <ng-table-filter-row></ng-table-filter-row> ');
  $templateCache.put('ng-table/pager.html', 
    '<div>{{ params.data.length }}</div><div class="ng-cloak ng-table-pager text-center" ng-if="params.data.length">' + 
        '<div ng-if="params.settings().counts.length" class="ng-table-counts btn-group pull-right">' + 
            '<button ng-repeat="count in params.settings().counts" type="button" ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)" class="btn btn-default">' + 
                '<span ng-bind="count"></span>' + 
            '</button>' + 
        '</div>' + 
        '<ul ng-if="pages.length" class="pagination ng-table-pagination">' + 
            '<li ng-class="{\'disabled\': !page.active && !page.current, \'active\': page.current}" ng-repeat="page in pages" ng-switch="page.type">' + 
                '<a ng-switch-when="prev" ng-click="params.page(page.number)" href="">' + 
                    '<i class="fa fa-fw fa-angle-left text-dark"></i>上一页' + 
                '</a>' + 
                '<a ng-switch-when="first" ng-click="params.page(page.number)" href="" class="m-r-xs">' + 
                    '<span ng-bind="page.number"></span>' + 
                '</a>' + 
                '<a ng-switch-when="page" ng-click="params.page(page.number)" href="" class="m-r-xs">' + 
                    '<span ng-bind="page.number"></span>' + 
                '</a>' + 
                '<a ng-switch-when="more" ng-click="params.page(page.number)" href="" class="m-r-xs">&#8230;</a>' + 
                '<a ng-switch-when="last" ng-click="params.page(page.number)" href="" class="m-r-xs">' + 
                    '<span ng-bind="page.number"></span>' + 
                '</a>' + 
                '<a ng-switch-when="next" ng-click="params.page(page.number)" href="">下一页' + 
                    '<i class="fa fa-fw fa-angle-right text-dark"></i>' + 
                '</a>' + 
            '</li>' + 
        '</ul>' + 
    '</div> ');
  $templateCache.put('ng-table/sorterRow.html', '<tr class="conow-grid-header"> <th title="{{$column.headerTitle(this)}}" ng-repeat="$column in $columns" ng-class="{ \'sortable\': $column.sortable(this), \'sort-asc\': params.sorting()[$column.sortable(this)]==\'asc\', \'sort-desc\': params.sorting()[$column.sortable(this)]==\'desc\' }" ng-click="sortBy($column, $event)" ng-if="$column.show(this)" ng-init="template=$column.headerTemplateURL(this)" class="conow-grid-header-item {{$column.class(this)}}"> <div ng-if="!template" class="ng-table-header" ng-class="{\'sort-indicator\': params.settings().sortingIndicator==\'div\'}"> <span ng-bind="$column.title(this)" ng-class="{\'sort-indicator\': params.settings().sortingIndicator==\'span\'}"></span> </div> <div ng-if="template" ng-include="template"></div> </th> </tr> ');
  $templateCache.put('ng-table/noDataTip.html', '<td ng-if="params.settings().$loading === false && params.settings().total == 0 && params.data.length == 0" colspan="{{ :: $columns.length }}" ng-bind="controlParams.noDataTip"></td>' + 
              '<td ng-if="params.settings().$loading === true" colspan="{{ :: $columns.length }}"><i class="fa fa-spin fa-spinner"></i>加载中...</td>');
  $templateCache.put('ng-table/search.html', '<input type="text" class="form-control" placeholder="请输入关键字进行搜索" ng-table-search="vm" ng-model="vm.searchKey" ng-keyup="searchTrigger($event)">');
  $templateCache.put('ng-table/headerCheckbox.html', '<label class="i-checks" ng-if="controlParams.isShowCheckbox"><input type="checkbox" ng-checked="vm.isAllSelected" ng-click="thCheckboxClick($event, $data)" class="header-checkbox"><i></i></label>');
}]);
    return angular.module('ngTable');
}));