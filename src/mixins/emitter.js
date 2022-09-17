  /**
   * @param { string } componentName => 目标组件名称
   * @param { string } eventName => 事件名称
   * @param { any } params => 载荷参数
   */
  function broadcast(componentName, eventName, params) {
      //递归子组件，查找命名空间内组件
      this.$children.forEach(child => {
          var name = child.$options.componentName;

          if(name === componentName) {
              //分发子组件内订阅消息
              child.$emit.apply(child, [eventName].concat(params));
          } else {
              broadcast.apply(child, [componentName, eventName].concat([params]));
          }
      });
  }
  export default {
      methods: {
          dispatch(componentName, eventName, params) {
              var parent = this.$parent || this.$root;
              var name = parent.$options.componentName;
              //循环查询父组件，找到目标父组件
              while(parent && (!name || name !== componentName)) {
                  parent = parent.$parent;

                  if(parent) {
                      name = parent.$options.componentName;
                  }
              }
              if(parent) {
                  //分发父组件订阅内容
                  parent.$emit.apply(parent, [eventName].concat(params));
              }
          },
          broadcast(componentName, eventName, params) {
              broadcast.call(this, componentName, eventName, params);
          }
      }
  };