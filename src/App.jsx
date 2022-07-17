import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Alert, Card, Layout, Skeleton, Space, Typography } from 'antd'
import './App.css'
import api from './api'
import LeftMenuItem from './components/LeftMenuItem'
import Viewer from './components/Viewer'
const { Content, Sider } = Layout
const App = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const orden = queryParams.get('orden')
  const [dicomId, setDicomId] = useState()
  const lista = useQuery('files',
    async () => await api.get(`/user/public/imagen/ordenes/${orden}/attachments`), {
      enabled: !!orden,
      staleTime: 'Infinity',
      onSuccess: (data) => {
        const dicoms = data.data.filter(x => x.mimetype === 'application/octet-stream')
        if (dicoms[0]?._id !== undefined && dicomId === undefined) {
          setDicomId(dicoms[0]?._id)
        }
      }
    })
  if (orden === null) {
    return <Alert message={'No se proporcionó una orden'} type='error' showIcon/>
  }
  return (
<Layout hasSider>
<Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center'
      }}
    >
        {
          lista.isLoading
            ? <Skeleton/>
            : <Space direction='vertical' style={{ marginLeft: 5 }}>
           { lista.data?.data.filter(x => x.mimetype === 'application/octet-stream').map(x =>
              <Card key={x._id} hoverable bodyStyle={{ padding: 0 }}
              style={{ width: '100%', borderColor: '#177ddc' }}
              bordered={x._id === dicomId}
              onClick={() => setDicomId(x._id)}
              >
                <LeftMenuItem dicomId={x._id}/>
              </Card>

           )}
            </Space>
    }

    </Sider>
<Layout className="site-layout" style={{ marginLeft: 216 }}>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
    <Viewer dicomId={dicomId}/>
      </Content>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Typography.Text type='secondary'>Desarrollado por Departamento Tecnología, Innova-Salud S.A 2022</Typography.Text>
    </div>
  </Layout>
</Layout>
  )
}

export default App
