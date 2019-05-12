import { Tag, Icon, Select } from 'antd';
import React from 'react';
import { Stock } from '@services/gql/stock';

interface IProps {
  stocks: Stock[];
  setStocks: (stocks: Stock[]) => void;
  max: number;
  source: Stock[];
}

export class DynamicSelectTag extends React.Component<IProps> {
  input = undefined;
  state = {
    inputVisible: false,
    inputValue: ''
  };

  handleClose = removedTag => {
    const stocks = this.props.stocks.filter(tag => tag !== removedTag);
    this.props.setStocks(stocks);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { stocks } = this.props;
    if (!inputValue) {
      return null;
    }
    const newStocks: Stock[] = [...stocks, JSON.parse(inputValue)];
    this.setState({
      inputVisible: false,
      inputValue: ''
    });
    this.props.setStocks(newStocks);
  };

  saveInputRef = (input: any) => (this.input = input);

  render() {
    const { inputVisible, inputValue } = this.state;
    const { stocks, max, source } = this.props;
    const MAX = max || 99;
    return (
      <div>
        {stocks.map(tag => (
          <Tag key={tag.id} closable onClose={() => this.handleClose(tag)}>
            {tag.goodsCode}
          </Tag>
        ))}
        {inputVisible && (
          <Select
            ref={this.saveInputRef}
            placeholder="选择商品识别码"
            showSearch
            size="small"
            optionFilterProp="children"
            style={{ width: 120 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            // @ts-ignore
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {source
              .filter(i => !stocks.map(s => s.id).includes(i.id))
              .map(option => {
                return (
                  <Select.Option key={option.id} value={JSON.stringify(option)}>
                    {option.goodsCode}
                  </Select.Option>
                );
              })}
          </Select>
        )}
        {!inputVisible && stocks.length < MAX && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" />
            添加商品识别码
          </Tag>
        )}
      </div>
    );
  }
}
