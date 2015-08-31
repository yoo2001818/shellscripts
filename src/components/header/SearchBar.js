import React, { Component, PropTypes } from 'react';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: ''
    };
  }
  handleChange(e) {
    this.setState({
      keyword: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const { router } = this.context;
    const { keyword } = this.state;
    router.transitionTo('/search', {}, {keyword});
  }
  render() {
    const { keyword } = this.state;
    return (
      <div className='search'>
        <div className='search-form'>
          <form action='/search' method='get'
            onSubmit={this.handleSubmit.bind(this)}>
            <div className='search-text'>
              <input name='keyword' type='text' placeholder='Search'
                value={keyword} onChange={this.handleChange.bind(this)} />
            </div>
            <div className='search-btn'>
              <button><i className='fa fa-search'></i></button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

SearchBar.contextTypes = {
  router: PropTypes.func
};
