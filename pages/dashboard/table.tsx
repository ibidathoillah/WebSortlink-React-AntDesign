import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './table.sass';
import { Table, Input, InputNumber, Popconfirm, Form, Space, message } from 'antd';
import { updateLink, deleteLink, ShortLinkPaginate } from '../../api/shortlink';
import { catchErr } from '../../utils/error';
import { mappingData } from '.';
import { CopyOutlined} from '@ant-design/icons';
import moment from 'moment';
import { copyToClipboard } from '../../utils/utils';
import { APIShortLink } from '../../api/auth';


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({originData}) => {
  console.log(originData)
  let datas:ShortLinkPaginate = originData
  const [form] = Form.useForm();
  const [data, setData] = useState(datas);
  const [editingKey, setEditingKey] = useState('');

  useEffect(()=>{
    setData(datas)
  },[datas]);   

  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({
      title: '',
      slug: '',
      redirectUrl: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const del = (record) => {
    deleteLink(record.key)
    .then(async res => {
      setData(await mappingData(data.page).catch(catchErr))
    })
    
    
  };

  const cancel = (d) => {
    console.log("asdsadas",d)
    setEditingKey('');
  };
  const changePage = async (d) => {
    setData(await mappingData(d).catch(catchErr))
    setEditingKey('');
  };

 

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data.docs];
      const index = newData.findIndex(item => key === item.key);
    
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
      } else {
        newData.push(row);
      }

      updateLink(newData[index]).then((x)=>{
        setData({...datas, docs: newData});
        setEditingKey('');
      }).catch(catchErr)
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: '15%',
      editable: true,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      width: '15%',
      editable: true,
      render:(_, record) => {
        return (<span><a onClick={()=> {
          let link = `${APIShortLink.baseUrl}/${record.slug}`
          copyToClipboard(link);
          message.success(`Link copied`);
        }}>/{record.slug} <CopyOutlined /></a></span>)
      }
    },
    {
      title: 'URL',
      dataIndex: 'redirectUrl',
      width: '40%',
      editable: true,
      render:(_, record) => {
        return (<span><a target="_blank" href={record.redirectUrl}>{record.redirectUrl}</a></span>)
      }
    },
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      width: '15%',
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render:(_, record) => {
        return moment(record.createdAt).format("DD/MM/YYYY HH:mm:ss")
      }
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
          <a disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </a>
          <span>
            <Popconfirm title="Sure to delete?" onConfirm={() => del(record)}>
              <a>Delete</a>
            </Popconfirm>
          </span>
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'redirectUrl' ? 'url' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data ? data.docs : []}
        columns={mergedColumns}
        rowClassName="editable-row"
        sortDirections={["ascend"]}
        tableLayout='fixed'
        pagination={{
          current: data ? data.page : 1,
          total: data ? data.total : 0,
          onChange: changePage,
        }}
      />
    </Form>
  );
};

export default EditableTable