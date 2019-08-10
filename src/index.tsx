import React, { Component } from 'react';
import ReactDOM from 'react-dom';

interface IProps {
  className: string;
  src: string;
  alt: string;
  offset: number;
  defaultImgSrc?: string;
}

interface IState {
  isLoaded: boolean;
}

class ImgLazy extends Component<IProps, IState> {
  static defaultProps = {
    defaultImgSrc: '',
    offset: 0, // 默认距离
  };
  constructor (props: IProps) {
    super(props);
    // 初始状态
    this.state = {
      isLoaded: false,
    };
    this._handleScroll = this._handleScroll.bind(this);
    this._handleScroll = this.throttle(this._handleScroll, 100);
  }

  /**
   * 添加监听事件
   */
  componentDidMount () {
    window.addEventListener('scroll', this._handleScroll);
    window.addEventListener('resize', this._handleScroll);
    this._handleScroll();
  }

  /**
   * 移除事件
   */
  componentWillUnmount () {
    window.removeEventListener('scroll', this._handleScroll);
    window.removeEventListener('resize', this._handleScroll);
  }

  /**
   * 获取窗口的高度
   */
  getClientHeight () {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(
        document.body.clientHeight,
        document.documentElement.clientHeight,
      );
    } else {
      clientHeight = Math.max(
        document.body.clientHeight,
        document.documentElement.clientHeight,
      );
    }
    return clientHeight;
  }

  /**
   * 获取滚动条滚动的高度
   */
  getScrollTop () {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    } else {
      scrollTop = window.scrollY || window.pageYOffset;
    }

    return scrollTop;
  }

  /**
   * 获取当前图片距离顶部的xy坐标
   */
  getNodeTop () {
    const viewTop = this.getScrollTop();

    const img: any = ReactDOM.findDOMNode(this); // 当前节点
    const nodeTop = img.getBoundingClientRect().top + viewTop;
    const nodeBottom = nodeTop + img.offsetHeight;
    return {
      nodeTop: nodeTop,
      nodeBottom: nodeBottom,
    };
  }

  /**
   * 函数节流
   */
  throttle (fn: any, delay: number) {
    let canRun = true;
    return (...args: any[]) => {
      let context = this;

      if (!canRun) {
        return;
      }
      canRun = false;
      setTimeout(() => {
        fn.apply(context, args);
        canRun = true;
      },         delay);
    };
  }

  /**
   * 处理滚动事件
   */
  _handleScroll () {
    const { offset } = this.props; // 偏移量

    const { nodeTop, nodeBottom } = this.getNodeTop();

    const viewTop = this.getScrollTop();
    const viewBottom = viewTop + this.getClientHeight();

    // 当图片出现在视野范围内,设置真正的图片，同时移除监听
    if (nodeBottom + offset >= viewTop && nodeTop - offset <= viewBottom) {
      this.setState({
        isLoaded: true,
      });
      window.removeEventListener('scroll', this._handleScroll);
      window.removeEventListener('resize', this._handleScroll);
    }
  }

  render () {
    const { className, src, defaultImgSrc, alt } = this.props;
    const { isLoaded } = this.state;
    let trueSrc = isLoaded ? src : defaultImgSrc;
    return <img className={className} src={trueSrc} alt={alt} />;
  }
}

export default ImgLazy;
