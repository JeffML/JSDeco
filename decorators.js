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
    // substitute a new function for the original, this is what will be called instead
    descriptor.value = function (...args) {     
      const result = original.apply(this, args);  // call the now-wrapped original
      console.log(`${name}(${args}) = ${result}`)
    }
  }
}

const log2 = (target, name, descriptor) => {
  const original = descriptor.value;  

  if (typeof original === 'function') { 
    const paramNames = getParamNames(original)
    
    descriptor.value = function (...args) {
      const params = paramNames.reduce((obj, pn, i) => {
        obj[pn] = args[i];
        return obj;}, {} )

      const result = original.apply(this, args);
      console.log(`${name}(${JSON.stringify(params)}) = ${result}`)
    }
  }
}

const insertStuff = (target, name, descriptor) => {
  const original = descriptor.value;  

  if (typeof original === 'function') { 
    const paramNames = getParamNames(original)
    descriptor.value = function () {
      const args = paramNames.reduce((arr, pn, i) => {
        arr[i] = this.newStuff[pn];
        return arr;}, [] )

      const result = original.apply(this, [...args]);
      // console.log(`${name}(${JSON.stringify(args)}) = ${result}`)
    }
  }
}

class MyClass {
  @log
  sum(a, b) {
    return a + b;
  }

  @log2
  sum2(a, b) {
    return a + b;
  }

  @insertStuff
  getStuff(isWombat, sugar) {
    console.log({isWombat, sugar})
  }
}

const instance = new MyClass();
instance.sum2(4, 5);

const stuff = {
  isWombat: true,
  sugar: ["in the morning", "in the evening", "at suppertime"] 
}

instance.newStuff = stuff;

instance.getStuff();

instance.newStuff.sugar = ["You are my candy, girl", "and you keep me wanting you"];

instance.getStuff();

