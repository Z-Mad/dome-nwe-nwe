// 最推荐的解决方案 - 使用decimal.js库的模拟实现
export const safeMultiply = (a: number, b: number): number => {
    // 获取小数位数
    const decimalPlaces = (num: number) => {
        const str = num.toString();
        return str.includes('.') ? str.split('.')[1].length : 0;
    };
    
    const dpA = decimalPlaces(a);
    const dpB = decimalPlaces(b);
    const factorA = Math.pow(10, dpA);
    const factorB = Math.pow(10, dpB);
    
    const intA = a * factorA;
    const intB = b * factorB;
    
    return (intA * intB) / (factorA * factorB);
}