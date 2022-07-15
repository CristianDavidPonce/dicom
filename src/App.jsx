
import React, { useState } from 'react'
import CornerstoneViewport from 'react-cornerstone-viewport'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import { useQuery } from 'react-query'
import { Alert, Button, Col, List, Menu, Row, Skeleton, Spin, Typography } from 'antd'
import cornerstone from 'cornerstone-core'
import './App.css'
import { CameraOutlined } from '@ant-design/icons'
import api from './api'

const App = () => {
  const [file, setFile] = useState()
  const queryParams = new URLSearchParams(window.location.search)
  const orden = queryParams.get('orden')
  console.log(orden)
  const [dicomId, setDicomId] = useState()
  const [scale, setScale] = useState(1)
  const [, setElement] = useState(null)
  const query = useQuery('1',
    async () => await api.get(`/user/public/imagen/ordenes/${orden}/attachments/${dicomId}`,
      { responseType: 'blob' }), {
      enabled: false,
      onSuccess: (data) => {
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(
          data.data
        )
        cornerstone.loadImage(imageId).then(image => {
          const frames = image.data.string('x00280008')
          const images = []
          for (let i = 0; i < frames; i++) {
            images.push(`${imageId}?frame=${i}`)
          }
          setFile(images)
        }
        )
      }
    })
  const lista = useQuery('files',
    async () => await api.get(`/user/public/imagen/ordenes/${orden}/attachments`), {
      staleTime: 0,
      onSuccess: (data) => {
        const dicoms = data.data.filter(x => x.mimetype === 'application/octet-stream')
        if (dicoms[0]?._id !== undefined) {
          setDicomId(dicoms[0]?._id)
          query.refetch()
        }
      }
    })

  return (
<>
       <Row gutter={10}>
        <Col sx={{ span: 24 }} md={{ span: 4 }}>
        {
          lista.isFetching
            ? <Skeleton/>
            : <Menu
          style={{ width: '100%' }}
          defaultSelectedKeys={[lista.data?.data.filter(x => x.mimetype === 'application/octet-stream')[0]._id]}
          mode="inline"
          items={
            lista.data?.data.filter(x => x.mimetype === 'application/octet-stream').map(x => ({
              label: x.name,
              key: x._id,
              icon: <CameraOutlined/>
            }))
          }
    />
    }
    <Alert type='info'
    closable
    message={'Ayuda'}
    description={
      <List
       dataSource={[
         {
           label: 'Brillo/Contraste',
           value: 'Click izquierdo, arrastrar'
         },
         {
           label: 'Zoom',
           value: 'Click derecho, arrastrar'
         },
         {
           label: 'Mover',
           value: 'Scroll Button, arrastrar'
         },
         {
           label: 'Siguiente frame',
           value: 'Scroll'
         }

       ]}
       renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={item.label}
            description={item.value}
          />
        </List.Item>
       )}
      />
    }/>
        </Col>
        <Col sx={{ span: 24 }} md={{ span: 20 }}>
          {
           query.isError && <Alert message={query.error?.message || 'Error al cargar la imagen'} type='error' action={
              <Button
              onClick={query.refetch}
              >Reintentar</Button>
          }/>}
        {
    file &&
      <CornerstoneViewport
        style={
          {
            width: '100%',
            height: '90vh'
          }
        }
        imageIds={
          file
        }
        tools={ tools }
        scale={scale}
        onElementEnabled={(elementEnabledEvt) => {
          const cornerstoneElement = elementEnabledEvt.detail.element

          setElement(cornerstoneElement)

          cornerstoneElement.addEventListener(
            'cornerstoneimagerendered',
            (imageRenderedEvent) => {
              const v = imageRenderedEvent.detail.viewport
              setScale(v)
            }
          )
        }}
        />
    }
        </Col>

       </Row>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Typography.Text type='secondary'>Desarrollado por Departamento Tecnología, Innova-Salud S.A 2022</Typography.Text>
    </div>
</>
  )
}

export default App

const tools = [
  // Mouse
  {
    name: 'Wwwc',
    mode: 'active',
    modeOptions: { mouseButtonMask: 1 }
  },
  {
    name: 'Zoom',
    mode: 'active',
    modeOptions: { mouseButtonMask: 2 }
  },
  {
    name: 'Pan',
    mode: 'active',
    modeOptions: { mouseButtonMask: 4 }
  },
  // Scroll
  { name: 'StackScrollMouseWheel', mode: 'active' },
  // Touch
  { name: 'PanMultiTouch', mode: 'active' },
  { name: 'ZoomTouchPinch', mode: 'active' },
  { name: 'StackScrollMultiTouch', mode: 'active' }
]
