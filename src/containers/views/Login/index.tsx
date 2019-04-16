import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import { Form, Icon, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { hot } from 'react-hot-loader';

import * as styles from './index.scss';

const FormItem = Form.Item;

interface IStoreProps {
  routerStore?: RouterStore;
  login?: (data: IAuthStore.LoginParams) => Promise<any>;
}

@inject(
  (store: IStore): IStoreProps => {
    const { routerStore, authStore } = store;
    const { login } = authStore;
    return {
      routerStore,
      login
    };
  }
)
@observer
class Login extends React.Component<IStoreProps & FormComponentProps> {
  @observable
  private loading: boolean = false;

  submit = (e: React.FormEvent<any>): void => {
    e.preventDefault();
    this.props.form.validateFields(
      async (err, values): Promise<any> => {
        if (!err) {
          runInAction('SHOW_LOGIN_LOADING', () => {
            this.loading = true;
          });
          await this.props.login(values);
          runInAction('HIDE_LOGIN_LOADING', () => {
            this.loading = false;
          });
        }
      }
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.login}>
        <Form onSubmit={this.submit} className={styles.form}>
          <div className={styles.logoBox}>
            <Icon type="ant-design" />
          </div>
          <FormItem hasFeedback>
            {getFieldDecorator('account', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="account" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="password"
              />
            )}
          </FormItem>
          <FormItem>
            <div className={styles.tips}>
              <span>username: admin</span>
              <span>password: admin</span>
            </div>
            <Button type="primary" htmlType="submit" block loading={this.loading}>
              login
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default hot(module)(Form.create<{}>()(Login));
