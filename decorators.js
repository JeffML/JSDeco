// source: https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
    result = [];
  return result;
}

const log = (target, name, descriptor) => {
  /*
    target: the class instance of the method
    name: the name of the method
    descriptor:  
      value: the method itself 
  */

  const original = descriptor.value;  // hold onto the original function

  if (typeof original === 'function') {  //ensure that it is a function
    descriptor.value = function (...args) {
      const result = original.apply(this, args);
      console.log(`${name}(${args}) = ${result}`)
    }
  }
}

class MyClass {
  @log
  sum(a, b) {
    return a + b;
  }
}

const instance = new MyClass();
instance.sum(2, 3);