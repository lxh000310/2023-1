/**
 * 接收一个异步函数的数组，然后让他们依次执行
 * 
 */
export async function serialPromise(fnArr) {
	for(let i=0; i<fnArr.length; i++) {
		await fnArr[i]();
	}
}
/**
 * setTimeout的promise版
 * 
 */
export function setTimeoutPro(duration) {
	return new Promise(resolve => {
		setTimeout(resolve, duration);
	});
}

// window.Utils = { serialPromise, setTimeoutPro };

/*Utils.serialPromise([
	()=>Utils.setTimeoutPro(2000).then(()=>console.log('1')),
	()=>Utils.setTimeoutPro(2000).then(()=>console.log('2')),
	()=>Utils.setTimeoutPro(2000).then(()=>console.log('3')),
	()=>Utils.setTimeoutPro(2000).then(()=>console.log('4')),
	()=>Utils.setTimeoutPro(2000).then(()=>console.log('5')),
	()=>Utils.setTimeoutPro(1000).then(()=>console.log('6')),
	()=>Utils.setTimeoutPro(1000).then(()=>console.log('7')),
	()=>Utils.setTimeoutPro(100).then(()=>console.log('8')),
	()=>Utils.setTimeoutPro(100).then(()=>console.log('9')),
	()=>Utils.setTimeoutPro(100).then(()=>console.log('10')),
	()=>Utils.setTimeoutPro(3000).then(()=>console.log('11')),
])*/
