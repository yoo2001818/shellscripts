import './style/TagSelect.scss';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import AutoSizeInput from 'react-input-autosize';

export default class TagSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      inputValue: '',
      value: props.value || []
    };
  }
  componentWillMount() {
    this.setState({
      value: this.props.value || this.state.value || []
    });
  }
  componentWillReceiveProps(props) {
    this.setState({
      value: props.value || this.state.value || []
    });
  }
  handleChange(e) {
    let splited = e.target.value.split(/[\n,\. ]/);
    if (splited.length > 1) {
      const newValue =
        this.state.value.concat(
          splited.slice(0, splited.length - 1).map(tag => tag.toLowerCase())
        ).sort().filter((item, pos, ary) => !pos || item != ary[pos - 1]);
      this.setState({
        inputValue: splited[splited.length - 1],
        value: newValue
      });
      if (this.props.onChange) {
        this.props.onChange({
          target: {
            value: newValue
          }
        });
      }
    } else {
      this.setState({
        inputValue: e.target.value
      });
    }
  }
  handleRemove(key) {
    const newValue = this.state.value.slice();
    newValue.splice(key, 1);
    this.setState({
      value: newValue
    });
    if (this.props.onChange) {
      this.props.onChange({
        target: {
          value: newValue
        }
      });
    }
  }
  handleKeyPress(e) {
    const { keyCode, charCode } = e.nativeEvent;
    if (keyCode === 13 || charCode === 44 || charCode === 59 ||
      charCode === 32
    ) {
      const { inputValue } = this.state;
      if (inputValue !== '') {
        const newValue =
          this.state.value.concat([inputValue.toLowerCase()])
          .sort().filter((item, pos, ary) => !pos || item != ary[pos - 1]);
        this.setState({
          inputValue: '',
          value: newValue
        });
        if (this.props.onChange) {
          this.props.onChange({
            target: {
              value: newValue
            }
          });
        }
      }
      e.preventDefault();
    }
  }
  handleBlur() {
    const { inputValue } = this.state;
    let newValue = this.state.value;
    if (inputValue !== '') {
      newValue = this.state.value.concat([inputValue.toLowerCase()]).sort();
      this.setState({
        inputValue: '',
        value: newValue,
        focus: false
      });
      if (this.props.onChange) {
        this.props.onChange({
          target: {
            value: newValue
          }
        });
      }
    } else {
      this.setState({
        focus: false
      });
    }
    if (this.props.onBlur) {
      this.props.onBlur({
        target: {
          value: newValue
        }
      });
    }
  }
  handleFocus() {
    this.refs.input.focus();
    this.setState({
      focus: true
    });
    if (this.props.onFocus) {
      this.props.onFocus({
        target: this.state
      });
    }
  }
  render() {
    const value = this.props.value || this.state.value;
    return (
      <div className={classNames('tag-select', this.props.className, {
        focus: this.state.focus
      })} onClick={this.handleFocus.bind(this)}>
        { value.length === 0 && this.state.inputValue === '' ? (
          <div className='tag-placeholder'>
            {this.props.placeholder}
          </div>
        ) : false}
        { value.map((tag, key) => (
          <div className='tag-entry' key={key}
            onClick={this.handleRemove.bind(this, key)}
          >
            { tag }
            <i className='fa fa-times' />
          </div>
        ))}
        <AutoSizeInput ref='input' value={this.state.inputValue}
          className='input'
          onChange={this.handleChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
        />
      </div>
    );
  }
}

TagSelect.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.array,
  className: PropTypes.string,
  placeholder: PropTypes.string
};
