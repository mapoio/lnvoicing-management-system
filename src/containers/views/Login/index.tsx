import * as React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { hot } from 'react-hot-loader';
import { AuthStore } from '@store/auth';

import * as styles from './index.scss';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const useAuthStore = AuthStore.useStore;
const useState = React.useState;

const Login = (form: WrappedFormUtils) => {
  const loadding = useAuthStore(s => s.loadding);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submit = (e: React.FormEvent<any>): void => {
    e.preventDefault();
    AuthStore.dispatch('login', {
      account: username,
      password
    });
  };

  return (
    <div className={styles.login}>
      <Form onSubmit={submit} className={styles.form}>
        <div className={styles.logoBox}>
          <Icon type="ant-design" />
        </div>
        <FormItem hasFeedback>
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="account"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormItem>
        <FormItem hasFeedback>
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <div className={styles.tips}>
            <span>username: admin</span>
            <span>password: admin</span>
          </div>
          <Button type="primary" htmlType="submit" block loading={loadding}>
            login
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default hot(module)(Login);
