import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tooltip, Input, Row, Col, Tag, Badge } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { EmployeeStore } from '@store/employee';
import { Employee, employeeType, EmployeeRole } from '@services/gql/employee';
import { CreateModal } from './create';
import { UpdateModal } from './update';
import * as styles from '@shared/style/index.scss';
import { cloneDeep } from 'lodash';

const { useStore, dispatch } = EmployeeStore;

interface IOptionColProps {
  record: Employee;
}

const OptionCol = (props: IOptionColProps) => {
  const record = props.record;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const onDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch('deleteSingle', record.id);
      message.success('成功删除本员工！');
    } catch (e) {
      setDeleteLoading(false);
      message.error('删除员工失败！');
    }
  };
  const onUpdate = async () => setUpdateShow(true);
  const activeShow = record.user.blocked
    ? {
        title: '启用本员工',
        icon: 'check'
      }
    : {
        title: '停用本员工',
        icon: 'stop'
      };
  const onChangeActive = async () => {
    const newData = cloneDeep(record);
    newData.user.blocked = !record.user.blocked;
    setActiveLoading(true);
    try {
      await dispatch('update', newData);
      message.success('成功' + activeShow.title);
    } catch (e) {
      message.error(activeShow.title + '失败！');
    }
    setActiveLoading(false);
  };
  return (
    <>
      <UpdateModal show={updateShow} onShow={setUpdateShow} data={record} />
      <Tooltip title={activeShow.title}>
        <Button icon={activeShow.icon} type="default" shape="circle" loading={activeLoading} onClick={onChangeActive} />
      </Tooltip>
      <Tooltip title="修改本条数据">
        <Button icon="edit" type="default" shape="circle" onClick={onUpdate} />
      </Tooltip>
      <Tooltip title="删除本条数据">
        <Button icon="delete" type="danger" shape="circle" loading={deleteLoading} onClick={onDelete} />
      </Tooltip>
    </>
  );
};

const columns: Array<ColumnProps<Employee>> = [
  {
    title: '唯一ID',
    dataIndex: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '电话',
    dataIndex: 'phone'
  },
  {
    title: '职位',
    dataIndex: 'position'
  },
  {
    title: '登录名',
    dataIndex: 'user.username'
  },
  {
    title: '电子邮件',
    dataIndex: 'user.email'
  },
  {
    title: '员工状态',
    dataIndex: 'user.blocked',
    render: (blocked: boolean) => <Badge status={blocked ? 'error' : 'success'} text={blocked ? '已停用' : '已激活'} />
  },
  {
    title: '员工类型',
    dataIndex: 'type',
    render: (type: employeeType) => {
      const employeeTypeBox =
        {
          [employeeType.REGULAI]: {
            text: '正式员工',
            color: '#f50'
          },
          [employeeType.INTERN]: {
            text: '实习生',
            color: '#108ee9'
          },
          [employeeType.OUTWORKER]: {
            text: '外包员工',
            color: '#87d068'
          }
        }[type] || {};
      if (!employeeTypeBox) {
        return <Tag color="red">未知类型</Tag>;
      }
      return <Tag color={employeeTypeBox.color}>{employeeTypeBox.text}</Tag>;
    }
  },
  {
    title: '权限',
    dataIndex: 'role',
    render: (role: EmployeeRole) => {
      const roleOption = {
        [EmployeeRole.ADMIN]: '管理',
        [EmployeeRole.PURCHASE]: '采购',
        [EmployeeRole.RESALE]: '售后',
        [EmployeeRole.SALE]: '销售',
        [EmployeeRole.STOCK]: '仓库',
        [EmployeeRole.USER]: '用户'
      };
      return <Tag color="#108ee9">{roleOption[role]}</Tag>;
    }
  },
  {
    title: '操作',
    render: (_, record) => {
      return <OptionCol record={record} />;
    }
  }
];

export const Tables = () => {
  const list = useStore(s => s.list);
  const [loading, setLoding] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const onShowCreate = () => {
    setShowCreate(true);
  };
  const getData = async (num: number = 5) => {
    setLoding(true);
    try {
      await dispatch('getList', num);
      message.success('获取员工数据成功');
    } catch (error) {
      message.error(error.message);
    }
    setLoding(false);
  };
  useEffect(() => {
    if (list.length < 1) {
      getData(500);
    }
    return () => false;
  }, []);
  return (
    <div className={styles.contain}>
      <CreateModal show={showCreate} onShow={setShowCreate} />
      <Row gutter={12}>
        <Col span={8}>
          <Input placeholder="输入名称搜索" value={search} onChange={onChangeSearch} />
        </Col>
        <Button icon="plus" type="primary" onClick={onShowCreate}>
          新建
        </Button>
        <Button icon="sync" type="default" loading={loading} onClick={() => getData(500)}>
          刷新
        </Button>
      </Row>
      <Table<Employee>
        columns={columns}
        dataSource={list.filter(item => item.name.includes(search))}
        rowKey={r => `${r.id}`}
        loading={loading}
        pagination={{ showSizeChanger: true }}
      />
    </div>
  );
};
