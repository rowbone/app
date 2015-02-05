angular.module('uiRouterSample.contacts', [
  'ui.router'
])
  
.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $stateProvider
        //////////////
        // Contacts //
        //////////////
        .state('contacts', {

          // With abstract set to true, that means this state can not be explicitly activated.
          // It can only be implicitly activated by activating one of its children.
      
      // 当抽象属性设置为true时，表示此状态不能被显式地激活。但是可以通过激活它的一个子状态隐式激活
          abstract: true,

          // This abstract state will prepend '/contacts' onto the urls of all its children.
      
      // 此抽象状态会在子状态的所有url前面加上'/contacts'
          url: '/contacts',

          // Example of loading a template from a file. This is also a top level state,
          // so this template file will be loaded and then inserted into the ui-view
          // within index.html.
      
      // 从文件加载模板的示例。这也是一个顶层状态，因此此模板文件会被加载并插入index.html的ui-view中
          templateUrl: 'app/contacts/contacts.html',

          // Use `resolve` to resolve any asynchronous controller dependencies
          // *before* the controller is instantiated. In this case, since contacts
          // returns a promise, the controller will wait until contacts.all() is
          // resolved before instantiation. Non-promise return values are considered
          // to be resolved immediately.
      
      // 使用 'resolve' ，在控制器被实例化之前分解所有异步的控制器依赖。在这里，因为 'contacts' 返回一个承诺，控制器会等到 'contacts.all()'转变后才会实例化。
      // 非承诺的返回值会被立即分解。
          resolve: {
            contacts: ['contacts',
              function( contacts){
                return contacts.all();
              }]
          },

          // You can pair a controller to your template. There *must* be a template to pair with.
          controller: ['$scope', '$state', 'contacts', 'utils',
            function (  $scope,   $state,   contacts,   utils) {

              // Add a 'contacts' field in this abstract parent's scope, so that all
              // child state views can access it in their scopes. Please note: scope
              // inheritance is not due to nesting of states, but rather choosing to
              // nest the templates of those states. It's normal scope inheritance.
        
        // 在抽象的父作用域里增加contacts属性，因此所有的子状态试图可以在他们自己的作用域获取它。
        // 请注意：作用域继承并不是因为嵌套的状态，而是选择去嵌套状态的模板。这是普通的作用域继承。
              $scope.contacts = contacts;

              $scope.goToRandom = function () {
                var randId = utils.newRandomKey($scope.contacts, "id", $state.params.contactId);

                // $state.go() can be used as a high level convenience method
                // for activating a state programmatically.
        
        // $state.go() 可以用来作为高层次的便利方法以编程的方式来激活一个状态。
                $state.go('contacts.detail', { contactId: randId });
              };
            }]
        })

        /////////////////////
        // Contacts > List //
        /////////////////////

        // Using a '.' within a state name declares a child within a parent.
        // So you have a new state 'list' within the parent 'contacts' state.
    
    // 在状态名利用 '.' 来在父状态中声明一个子状态。在这里，父 'contacts' 状态里有了一个新的 'list' 状态
        .state('contacts.list', {

          // Using an empty url means that this child state will become active
          // when its parent's url is navigated to. Urls of child states are
          // automatically appended to the urls of their parent. So this state's
          // url is '/contacts' (because '/contacts' + '').
      
      // 用一个空的url表示这个子状态会在其父状态的url被激活的时候就被激活。子状态的url会被自动的添加到父状态的url后面。因此，此状态的url就是'/contacts'（即'/contact' + ''）。
          url: '',

          // IMPORTANT: Now we have a state that is not a top level state. Its
          // template will be inserted into the ui-view within this state's
          // parent's template; so the ui-view within contacts.html. This is the
          // most important thing to remember about templates.

      // 重要提示：现在我们有了一个不是顶层状态的状态。它的模板会被插入其父状态模板的 ui-view 中，即contacts.html的ui-view中。这是关于模板最重要的事情。
          templateUrl: 'app/contacts/contacts.list.html'
        })

        ///////////////////////
        // Contacts > Detail //
        ///////////////////////

        // You can have unlimited children within a state. Here is a second child
        // state within the 'contacts' parent state.
    
    // 在一个状态中可以拥有无数个子状态。下面是在'contacts'这个父状态里的第二个子状态。
        .state('contacts.detail', {

          // Urls can have parameters. They can be specified like :param or {param}.
          // If {} is used, then you can also specify a regex pattern that the param
          // must match. The regex is written after a colon (:). Note: Don't use capture
          // groups in your regex patterns, because the whole regex is wrapped again
          // behind the scenes. Our pattern below will only match numbers with a length
          // between 1 and 4.
      
      // Urls 可以包含参数。它们可以像 :param 或者 { param }这样指定。
      // 如果使用 {}的方式，你也可以指定一个参数匹配的正则表达式。这个正则表达式需要卸载一个冒号（：）后面。
      // 注意：不要在正则表达式模式中使用捕获组，因为整个表达式已经被包裹在场景下面。下面的模式只会匹配1-4个数字。

          // Since this state is also a child of 'contacts' its url is appended as well.
          // So its url will end up being '/contacts/{contactId:[0-9]{1,4}}'. When the
          // url becomes something like '/contacts/42' then this state becomes active
          // and the $stateParams object becomes { contactId: 42 }.
      
      // 因为这个状态也是 'contacts'的一个子状态，它的url也会被添加（到父状态url后面）。
      // 因此，它的url就是以 '/contacts/{contactId:[0-9]{1,4}'结尾。当url是类似 '/contacts/42' 
      // 的形式时，此状态会被激活，并且 $stateParams 对象变成 { contactId: 42 }
          url: '/{contactId:[0-9]{1,4}}',

          // If there is more than a single ui-view in the parent template, or you would
          // like to target a ui-view from even higher up the state tree, you can use the
          // views object to configure multiple views. Each view can get its own template,
          // controller, and resolve data.
      
      // 如果父模板中包含不止一个 ui-view，或者你想指向一个在状态树上更高层级的ui-view，可以使用 'views' 对象来指定多重的视图。
      // 每一个视图都可以获取各自的模板，控制器和相关数据。

          // View names can be relative or absolute. Relative view names do not use an '@'
          // symbol. They always refer to views within this state's parent template.
          // Absolute view names use a '@' symbol to distinguish the view and the state.
          // So 'foo@bar' means the ui-view named 'foo' within the 'bar' state's template.
      
      // 视图名可以是相对的或者绝对的。相对的视图名称不使用 '@'符号。它们也指的是此状态的父模板的视图。
      // 绝对的视图名使用 '@' 符号来区分视图和状态。因此 'foo@bar' 表示名称为 'bar' 状态的模板中名称为 'foo' 的ui-view。
          views: {

            // So this one is targeting the unnamed view within the parent state's template.
      
      // 因此，这一个指向父状态模板中的未命名视图
            '': {
              templateUrl: 'app/contacts/contacts.detail.html',
              controller: ['$scope', '$stateParams', 'utils',
                function (  $scope,   $stateParams,   utils) {
                  $scope.contact = utils.findById($scope.contacts, $stateParams.contactId);
                }]
            },

            // This one is targeting the ui-view="hint" within the unnamed root, aka index.html.
            // This shows off how you could populate *any* view within *any* ancestor state.
      
      // 这一个指向未命名的根模板，亦称index.html中的 ui-view="hint"。aks(also know as)
      // 这里展示了怎样填充 *任何* 视图中的 *任何* 祖先状态。
            'hint@': {
              template: 'This is contacts.detail populating the "hint" ui-view'
            },

            // This one is targeting the ui-view="menuTip" within the parent state's template.
      
      // 这一个是指向父状态模板的 ui-view="menuTip"
            'menuTip': {
              // templateProvider is the final method for supplying a template.
              // There is: template, templateUrl, and templateProvider.
        
        // templateProvider 是提供模板的最终方法。有：template、templateUrl和templateProvider
              templateProvider: ['$stateParams',
                function (        $stateParams) {
                  // This is just to demonstrate that $stateParams injection works for templateProvider.
                  // $stateParams are the parameters for the new state we're transitioning to, even
                  // though the global '$stateParams' has not been updated yet.
          
          // 这里只是声明 $stateParams 注入为 templateProvider 工作。$stateParams 是我们过渡到的新状态的参数，即使全局的 '$stateParam' 还没有被更新。
                  return '<hr><small class="muted">Contact ID: ' + $stateParams.contactId + '</small>';
                }]
            }
          }
        })

        //////////////////////////////
        // Contacts > Detail > Item //
        //////////////////////////////

        .state('contacts.detail.item', {

          // So following what we've learned, this state's full url will end up being
          // '/contacts/{contactId}/item/:itemId'. We are using both types of parameters
          // in the same url, but they behave identically.
      
      // 因此，按照我们所学的，这个状态的完整url将会以 '/contacts/{contactId}/item/:itemId' 结尾。
      // 我们在同一个url里用了两种参数的类型，但是它们行为完全相同。
          url: '/item/:itemId',
          views: {

            // This is targeting the unnamed ui-view within the parent state 'contact.detail'
            // We wouldn't have to do it this way if we didn't also want to set the 'hint' view below.
            // We could instead just set templateUrl and controller outside of the view obj.
      
      // 这是针对父状态 'contact.detail'中的未命名 ui-view。如果我们也需要设置 'hint'视图，我们并不是非要这么做。
      // 取而代之，我们可以仅仅在view obj外面设置 templateUrl和controller
            '': {
              templateUrl: 'app/contacts/contacts.detail.item.html',
              controller: ['$scope', '$stateParams', '$state', 'utils',
                function (  $scope,   $stateParams,   $state,   utils) {
                  $scope.item = utils.findById($scope.contact.items, $stateParams.itemId);

                  $scope.edit = function () {
                    // Here we show off go's ability to navigate to a relative state. Using '^' to go upwards
                    // and '.' to go down, you can navigate to any relative state (ancestor or descendant).
                    // Here we are going down to the child state 'edit' (full name of 'contacts.detail.item.edit')
          
          // 这里我们展示了 go 导航到相对状态的能力。使用 '^' 来向上，'.' 来向下，你可以导航到任何相对的状态（祖先或者后代）。
          // 在这里我们向下到达 edit 子状态。（完整名称是 'contacts.detail.item.edit'）
                    $state.go('.edit', $stateParams);
                  };
                }]
            },

            // Here we see we are overriding the template that was set by 'contacts.detail'
      
      // 这里我们看到，重写了前面设置的 'contacts.detail' 的模板。
            'hint@': {
              template: ' This is contacts.detail.item overriding the "hint" ui-view'
            }
          }
        })

        /////////////////////////////////////
        // Contacts > Detail > Item > Edit //
        /////////////////////////////////////

        // Notice that this state has no 'url'. States do not require a url. You can use them
        // simply to organize your application into "places" where each "place" can configure
        // only what it needs. The only way to get to this state is via $state.go (or transitionTo)
    
    // 注意，这个状态并没有定义 'url'。状态并不需要一个url。你可以简单地使用它们来组织应用到不同的地方。每个地方仅仅配置它所需要的。
    // 唯一能够到达这个状态的方式就是通过 $state.go(或 transitionTo)
        .state('contacts.detail.item.edit', {
          views: {

            // This is targeting the unnamed view within the 'contacts.detail' state
            // essentially swapping out the template that 'contacts.detail.item' had
            // inserted with this state's template.
      
      // 这里针对 'contacts.detail' 状态中的未命名视图。本质上置换出'contacts.detail.item'已经插入的状态模板
            '@contacts.detail': {
              templateUrl: 'app/contacts/contacts.detail.item.edit.html',
              controller: ['$scope', '$stateParams', '$state', 'utils',
                function (  $scope,   $stateParams,   $state,   utils) {
                  $scope.item = utils.findById($scope.contact.items, $stateParams.itemId);
                  $scope.done = function () {
                    // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                    $state.go('^', $stateParams);
                  };
                }]
            }
          }
        });
    }
  ]
);
