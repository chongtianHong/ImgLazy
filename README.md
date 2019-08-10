# ImgLazy
基于react+typescript的图片懒加载组件

## 特点
性能突出，所有组件仅仅监听两个事件
使用函数节流，scroll、resize两个事件处理并不会频繁

## 使用方法
```
import React ,{Component} from 'react';
import ImgLazy from 'ImgLazy';

class Demo extends Component{

	render(){
		return(
			<div>
				<ImgLazy 
					src="http://img.png"
					defaultImgSrc="http://默认图片.png"
					offset={100}
					alt="图片描述"
				 />
			</div>
		)
	}
}
```
当<code>ImgLazy</code>在可视范围时，正在需要显示的图片才会进行加载。

## 使用方法
+ Props：字符串地址。真正需要显示图片的地址。
+ defaultImgSrc：字符串地址。在真正图片未显示时，会显示该地址的图片。
+ offset数值：设置图片离可视范围多少时提前加载。

## 源码解析
一、
通过内部状态的 isLoaded来控制真正的图片是否加载。当图片在可视范围时设置 isLoaded = true，这样，无论外部传递的 props.src 是否有改变，都会render。


二、
在组件挂载时需要监听 scroll和 resize事件；而图片在可视范围后需要解除事件绑定。
但是需要注意，在组件被移除时，也需要解除事件绑定。

三、
scroll 和 resize 这两个事件，触发相当的频繁，必须使用函数节流来维持性能。
