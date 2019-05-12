import { Tag, Input, Tooltip, Icon } from 'antd';
import React from 'react';

interface IProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  max?: number;
}

export class DynamicTag extends React.Component<IProps> {
  input = undefined;
  state = {
    inputVisible: false,
    inputValue: ''
  };

  handleClose = removedTag => {
    const tags = this.props.tags.filter(tag => tag !== removedTag);
    this.props.setTags(tags);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { tags } = this.props;
    let newTags = [...tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    this.setState({
      inputVisible: false,
      inputValue: ''
    });
    this.props.setTags(newTags);
  };

  saveInputRef = (input: any) => (this.input = input);

  render() {
    const { inputVisible, inputValue } = this.state;
    const { tags, max } = this.props;
    const MAX = max || 99;
    return (
      <div>
        {tags.map(tag => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 120 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && tags.length < MAX && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" />
            添加商品识别码
          </Tag>
        )}
      </div>
    );
  }
}
