import React, { Component, PropTypes } from 'react';

export default class Search extends Component {
  render() {
    const { keyword } = this.props.query;
    return (
      <div id="search">
        <h1>{`Search result for ${keyword}`}</h1>
        <p>
          {`Results come here`}
        </p>
      </div>
    );
  }
}

Search.propTypes = {
  query: PropTypes.shape({
    keyword: PropTypes.string
  })
};
