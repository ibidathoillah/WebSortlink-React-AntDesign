import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './index.sass';
import { Layout, Menu, Breadcrumb, Button, Space, Input, Popconfirm, Tag, message } from 'antd';
import { UserOutlined, LaptopOutlined } from '@ant-design/icons';
import EditableTable from './table';
import { PlusOutlined, RedoOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { createCustom, getShortlink, createRandom, isExist } from '../../api/shortlink'
import { isURL, convertToSlug } from '../../utils/utils';
import { catchErr } from '../../utils/error';
import { logOut } from '../../api/logout';

export async function mappingData (page) :Promise<any> {
  return await getShortlink(page).then(shortlinks=>{

      shortlinks.docs.forEach(element => {
        element.key = element._id
      });

      return shortlinks
  }).catch(catchErr);
}

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const stateData = {
    title: "",
    slug: "",
    redirectUrl: "",
    originData: null,
    isSlugExist: false,
    typing: false,
    typingTimeout: 0,
    slugValue: '',
    page:1
}

const Dashboard = () => {
const [data, setData] = useState(stateData);
const onCustomChange = async (e) => {
  setData({...data, slug: e.target.value, isSlugExist: await isExist(convertToSlug(e.target.value))})
}
const onURLChange = (e) => {
    setData({...data, redirectUrl: e.target.value})
}
const onTitleChange = (e) => {
    setData({...data, title: e.target.value})
}
const onCreateCustom = async (e) => {
    !data.isSlugExist ?
    createCustom(data).then(async res => {
      setData({...data, originData: await mappingData(data.page)})
    }).catch(catchErr) : message.error(`Slug '${data.slug}' has been used!`)

}
const onCreateRandom = async (e) => {
  return !data.redirectUrl ? message.warning('Please add your link first') :
  createRandom(data).then(async res => {
    setData({...data, originData: await mappingData(data.page)})
  }).catch(catchErr);
}
const onCustomClick = async (e) => {
  setData({...data, isSlugExist: await isExist(convertToSlug(data.slug))})
  return !data.redirectUrl ? message.warning('Please add your link first') :
  !isURL(data.redirectUrl) ? message.error('Your url is invalid') : message.success('Nice url! set your slug')
}

useEffect(()=>{
    (async()=>{
      let map = await mappingData(data.page);
      setData({...data, originData: map})
    })()
    
    localStorage.getItem("token") ? null : location.href= "/";
},[])
  

return (
  <Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2"><a onClick={logOut}>Logout</a></Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Manage Shorlink</Breadcrumb.Item>
      </Breadcrumb>
      <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['manage']}
            style={{ height: '100%' }}
          >
            <SubMenu key="manage" icon={<LaptopOutlined />} title="Manage">
              <Menu.Item key="1">ShortLink</Menu.Item>
            </SubMenu>
            {/* <SubMenu key="Profile" icon={<UserOutlined />} title="Profile">
              <Menu.Item key="2">Setting</Menu.Item>
            </SubMenu> */}
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Input style={{marginBottom: '20px'}} size="large" onChange={onURLChange} placeholder="http://example.com/your-link/" prefix={
                <Space>
                  {isURL(data.redirectUrl) ?(
                            <Popconfirm
                            placement="bottomLeft"
                            title={
                            <Space direction="vertical">
                                <span><Tag color={ !data.isSlugExist ? "success" : "error"}>/{convertToSlug(data.slug)}{ !data.isSlugExist ? "" : " Already Exist!"}</Tag></span>
                                <Input placeholder="Slug" onChange={onCustomChange}/>
                                <Input placeholder="Title if any" onChange={onTitleChange}/>
                            </Space>
                            }
                            icon={ !data.isSlugExist ? <CheckCircleOutlined style={{color:"green"}}/> : <CloseCircleOutlined  style={{color:"red"}}/>}
                            onConfirm={onCreateCustom}
                            okText="Generate"
                            cancelText="Cancel"
                            >
                            <Button type="primary" onClick={onCustomClick} icon={<PlusOutlined />} >
                                Custom
                            </Button>
                            </Popconfirm>
                  ):(
                    <Button type="primary" onClick={onCustomClick} icon={<PlusOutlined />} >
                        Custom
                    </Button>
                  )}
                   
                    <Button type="primary" onClick={onCreateRandom} icon={<RedoOutlined />} >
                        Random
                    </Button>
                </Space>
                }
            />
            <EditableTable originData={data.originData}/>
        </Content>
      </Layout>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
    );
}



export default Dashboard