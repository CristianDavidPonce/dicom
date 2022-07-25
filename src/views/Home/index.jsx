import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Alert, Button, Card, Descriptions, Drawer, Layout, Skeleton, Space, Typography } from 'antd'
import api from '../../api'
import LeftMenuItem from './components/LeftMenuItem'
import Viewer from './components/Viewer'
import { Context } from '../../Provider'
import moment from 'moment'
import { EyeOutlined } from '@ant-design/icons'
import { isMobile } from 'react-device-detect'
import { Navigate } from 'react-router-dom'
const { Content, Sider } = Layout
const { Item } = Descriptions
const Home = () => {
  useEffect(() => {
    document.title = 'Dicom Viewer'
  }, [])
  const queryParams = new URLSearchParams(window.location.search)
  const orden = queryParams.get('orden')
  const [drawer, setDrawer] = useState(false)
  const { dicomId, setDicomId } = useContext(Context)
  const result = useQuery(
    'result',
    async () => await api.get(`/user/public/imagen/ordenes/${orden}`), {
      enabled: !!orden,
      staleTime: 'Infinity'
    }
  )
  const lista = useQuery('files',
    async () => await api.get(`/user/public/imagen/ordenes/${orden}/attachments`), {
      enabled: !!orden,
      staleTime: 'Infinity'
    })
  if (orden === null) {
    return <Alert message={'No se proporcionó una orden'} type='error' showIcon/>
  }
  if (lista.data?.data.filter(x => x.mimetype === 'application/octet-stream')?.length <= 0) {
    return <Alert message={'No existen archivos DCOM'} type='warning' showIcon/>
  }
  if (isMobile) {
    return (<Navigate to={`movil/?orden=${orden}`}/>)
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
              <Button
              disabled={result.isFetching}
              loading={result.isFetching}
              icon={<EyeOutlined/>}
              onClick={() => setDrawer(true)}
              style={{ width: '100%', marginTop: 5 }}
              >Ver informe</Button>
           { lista.data?.data.filter(x => x.mimetype === 'application/octet-stream').map(x =>
              <Card key={x._id} hoverable bodyStyle={{ padding: 0 }}
              style={{ width: '100%', borderColor: '#177ddc' }}
              bordered={x._id === dicomId}
              onClick={() => setDicomId(x._id)}
              >
                <LeftMenuItem dicomId={x._id} firstDicom={lista.data?.data.filter(x => x.mimetype === 'application/octet-stream')[0]?._id}/>
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
      <Drawer visible={drawer} placement='right' onClose={() => setDrawer(false)} size={'large'}>
      <Descriptions layout='vertical' bordered size='small'>
      <Item label='Profesional Responsable' span={3}>{result?.data?.data?.result?.doctor?.completeName}</Item>
      <Item label='Paciente' span={3}>{result?.data?.data?.result?.patient?.completeName}</Item>
      <Item label='Fecha' span={3}>{result?.data?.data?.result?.attention?.date && moment(result?.attention?.date).format('YYYY-MM-DD')}</Item>
      <Item label='Servicio' span={3}>{result?.data?.data?.result?.children?.map(x => <>
      {x.descripcion}
      <br />
      </>)}</Item>
      <Item label='Infome' span={3} contentStyle={{ whiteSpace: 'break-spaces' }}>
      {result?.data?.data?.result?.informe}
</Item>
      <Item label='Conclusión' span={3}
      contentStyle={{ whiteSpace: 'break-spaces' }}
      >{result?.data?.data?.result?.conclusion}</Item>
    </Descriptions>
      </Drawer>
  </Layout>
</Layout>
  )
}

export default Home
