export function promisify(target, property, descriptor){
    descriptor.value = new Proxy(descriptor.value, {
        // 拦截函数的调用
        apply(method, context, argList){
            // 返回一个新建的Promise对象
            return new Promise((resolve, reject) => {
                // 调用原函数，并注入resolve、reject
                return Reflect.call(method, context, resolve, reject, ...argList);
            });
        }
    });
    return descriptor;
}

