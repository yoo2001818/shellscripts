import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

export default class InfiniteScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false
    };
  }
  render() {
    const { children, loader, errorRetry } = this.props;
    const { loading, error } = this.state;
    return (
      <div>
        {children}
        {loading && loader}
        {error && errorRetry}
      </div>
    );
  }
  componentDidMount() {
    this.attachScrollListener();
  }
  componentDidUpdate() {
    if (this.state.loading || this.state.error) return;
    this.attachScrollListener();
  }
  componentWillUnmount() {
    this.detachScrollListener();
  }
  attachScrollListener() {
    if (!this.props.hasMore || this.state.loading || this.state.error) {
      return;
    }
    if (this.boundScrollListener == null) {
      this.boundScrollListener = this.scrollListener.bind(this);
    }
    window.addEventListener('scroll', this.boundScrollListener);
    window.addEventListener('resize', this.boundScrollListener);
    setTimeout(() => this.scrollListener(), 10);
  }
  detachScrollListener() {
    window.removeEventListener('scroll', this.boundScrollListener);
    window.removeEventListener('resize', this.boundScrollListener);
  }
  scrollListener() {
    const el = findDOMNode(this);
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).
      scrollTop;
    if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight <
      (this.props.threshold || 250)) {
      if (this.state.error || this.state.loading || !this.props.hasMore) return;
      this.detachScrollListener();
      var promise = this.props.loadMore();
      if (!promise || typeof promise.then !== 'function') {
        throw new Error('loadMore must return a Promise!');
      }
      promise.then(() => {
        setTimeout(() => this.setState({
          loading: false,
          error: false
        }), 10);
      }, () => {
        setTimeout(() => this.setState({
          loading: false,
          error: true
        }), 10);
      });
      // What if promise has failed?
      // We can display 'retry' button I suppose - But that involves using
      // a state etc.
      if (!this.state.loading || this.state.error) {
        this.setState({
          loading: true,
          error: false
        });
      }
    }
  }
}

InfiniteScroll.propTypes = {
  children: PropTypes.node,
  loader: PropTypes.node,
  errorRetry: PropTypes.node,
  hasMore: PropTypes.bool,
  threshold: PropTypes.number,
  loadMore: PropTypes.func
};
