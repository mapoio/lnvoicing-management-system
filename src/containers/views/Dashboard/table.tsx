import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Tag, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { UserStore } from '@store/user';
import { IUser, UserStatus, UserType } from '@services/gql/user';

const { useStore, dispatch } = UserStore;

type adtdType = 'success' | 'processing' | 'default' | 'error' | 'warning';

const columns: Array<ColumnProps<IUser>> = [
  {
    key: 'userName',
    title: '用户名',
    dataIndex: 'userName'
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName'
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    key: 'realName'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '学院',
    dataIndex: 'academy',
    key: 'academy'
  },
  {
    title: '班级',
    dataIndex: 'className',
    key: 'className'
  },
  {
    title: '学号',
    dataIndex: 'studentNumber',
    key: 'studentNumber'
  },
  {
    title: '账户类型',
    dataIndex: 'type',
    key: 'type',
    render: text => {
      const typeColor = {
        [UserType.ACM]: '#108ee9',
        [UserType.EXTEND]: '#2db7f5',
        [UserType.LDAP]: '#87d068'
      };
      return <Tag color={typeColor[text]}>{text}</Tag>;
    }
  },
  {
    title: '账户状态',
    dataIndex: 'status',
    key: 'status',
    render: (text: UserStatus) => {
      const statusColor = {
        [UserStatus.ACTIVE]: 'success',
        [UserStatus.PEDDING]: 'warning',
        [UserStatus.PAUSE]: 'error'
      };
      const statusText = {
        [UserStatus.ACTIVE]: '激活',
        [UserStatus.PEDDING]: '审核',
        [UserStatus.PAUSE]: '暂停'
      };
      const color = statusColor[text] as adtdType;
      return <Badge status={color} text={statusText[text]} />;
    }
  },
  {
    title: '数据版本',
    dataIndex: 'version',
    key: 'version'
  }
];

export const Tables = () => {
  const list = useStore(s => s.list);
  const [loading, setLoding] = useState(false);
  const getUserData = async () => {
    setLoding(true);
    try {
      await dispatch('getUserData');
      message.success('获取用户数据成功');
    } catch (error) {
      message.error(error.message);
    }
    setTimeout(() => {
      setLoding(false);
    }, 1500);
  };
  useEffect(() => {
    if (list.length < 1) {
      getUserData();
    }
    return () => false;
  }, []);
  return (
    <div>
      <Button onClick={getUserData} loading={loading} type="primary">
        刷新
      </Button>
      <Table<IUser>
        columns={columns}
        dataSource={list}
        rowKey={r => r.id}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
