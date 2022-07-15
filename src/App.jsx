
import React, { useEffect, useState } from 'react'
import CornerstoneViewport from 'react-cornerstone-viewport'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import { useQuery } from 'react-query'
import axios from 'axios'
import { Alert, Button, Col, List, Menu, Row, Spin, Typography } from 'antd'
import cornerstone from 'cornerstone-core'
import './App.css'
import { CameraOutlined } from '@ant-design/icons'

const App = () => {
  const [file, setFile] = useState()
  const queryParams = new URLSearchParams(window.location.search)
  const term = queryParams.get('orden')
  const [scale, setScale] = useState(1)
  console.log(term)
  const [, setElement] = useState(null)
  const query = useQuery('1',
    async () => await axios.get('https://dev-dot-innova-dot-artem-296122.uc.r.appspot.com/dicom/0002',
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
  useEffect(() => { query.refetch() }, [])
  if (query.isError) {
    return <Alert message={query.error?.message || 'Error al cargar la imagen'} type='error' action={
    <Button
    onClick={query.refetch}
    >Reintentar</Button>
  }/>
  }
  return (
    <Spin spinning={query.isFetching} style={{ minHeight: '50%' }}>
       <Row gutter={10}>
        <Col sx={{ span: 24 }} md={{ span: 4 }}>
        <Menu
      style={{ width: '100%' }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={[
        { label: 'item 1', key: 'item-1', icon: <CameraOutlined /> },
        { label: 'item 2', key: 'item-2', icon: <CameraOutlined /> }
      ]}
    />
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
    </Spin>
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
