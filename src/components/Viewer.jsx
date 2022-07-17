import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-query'
import api from '../api'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import CornerstoneViewport from 'react-cornerstone-viewport'
import cornerstone from 'cornerstone-core'
import { Alert, Button, InputNumber, List, notification, Segmented, Space, Spin } from 'antd'
import { ArrowsAltOutlined, BgColorsOutlined, CaretRightOutlined, ColumnWidthOutlined, DeleteOutlined, DragOutlined, FormOutlined, LeftOutlined, PauseOutlined, QuestionOutlined, SearchOutlined, ZoomInOutlined } from '@ant-design/icons'
const openNotification = () => {
  notification.open({
    message: 'Ayuda',
    description:
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
   />,
    onClick: () => {
      console.log('Notification Clicked!')
    }
  })
}
const Viewer = ({ dicomId }) => {
  const queryParams = new URLSearchParams(window.location.search)
  const orden = queryParams.get('orden')
  const [play, setPlay] = useState(false)
  const [active, setActive] = useState('Wwwc')
  const [file, setFile] = useState()
  const [frames, setFrames] = useState(10)
  const query = useQuery(dicomId,
    async () => await api.get(`/user/public/imagen/ordenes/${orden}/attachments/${dicomId}`,
      { responseType: 'blob' }), {
      enabled: !!dicomId,
      staleTime: 'Infinity',
      onSuccess: (data) => {
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(
          data.data
        )
        cornerstone.loadImage(imageId).then(image => {
          const frames = image.data.string('x00280008')
          const images = []
          console.log(frames)
          if (frames !== undefined) {
            for (let i = 1; i < frames; i++) {
              images.push(`${imageId}?frame=${i}`)
            }
            setFile(images)
          } else {
            setFile([imageId])
          }
        }
        )
      }
    })

  return (
    <Spin spinning={query.isFetching} style={{ minHeight: '90vh' }}>
    {
      query.isError && <Alert message={query.error?.message || 'Error al cargar la imagen'} type='error' action={
        <Button
        onClick={query.refetch}
        >Reintentar</Button>
    }/>}
    <Segmented
    onChange={(value) => setActive(value)
    }
    defaultValue='Wwwc'
    options={[
      {
        label: 'Brillo/Contraste',
        value: 'Wwwc',
        icon: <BgColorsOutlined />
      },
      {
        label: 'Zoom',
        value: 'Zoom',
        icon: <ZoomInOutlined />
      },
      {
        label: 'Arrastrar',
        value: 'Pan',
        icon: <DragOutlined />
      },
      {
        label: 'Agrandar cuadro',
        value: 'Magnify',
        icon: <SearchOutlined />
      },
      {
        label: 'Regla',
        value: 'Length',
        icon: <ColumnWidthOutlined />
      },
      {
        label: 'Ángulo',
        value: 'Angle',
        icon: <LeftOutlined />
      },
      {
        label: 'Bidireccional',
        value: 'Bidirectional',
        icon: <ArrowsAltOutlined />
      },
      {
        label: 'Dibujar área',
        value: 'FreehandRoi',
        icon: <FormOutlined />
      },
      {
        label: 'Borrador',
        value: 'Eraser',
        icon: <DeleteOutlined />
      }
    ]}
  />
  {
file &&
<CornerstoneViewport
  style={
    {
      width: '100%',
      height: 'calc(100vh - 120px)'
    }
  }
  imageIds={
    file
  }
  tools={ toolsInit }
activeTool={active}
frameRate={frames}
isPlaying={play}
  />
}
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <Space>
    <Button icon={<CaretRightOutlined />} onClick={() => setPlay(true)}/>
    <Button icon={<PauseOutlined />} onClick={() => setPlay(false)}/>
    <InputNumber value={frames} onChange={(x) => setFrames(x)} prefix={'fps'}/>
  </Space>
  <Button icon={<QuestionOutlined />} onClick={openNotification}>Ayuda</Button>
</div>
</Spin>

  )
}

export default Viewer
Viewer.propTypes = {
  dicomId: PropTypes.string
}

const toolsInit = [
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
  'Length',
  'Angle',
  'FreehandRoi',
  'Eraser',
  'Magnify',
  'Bidirectional',
  // Scroll
  { name: 'StackScrollMouseWheel', mode: 'active' },
  // Touch
  { name: 'PanMultiTouch', mode: 'active' },
  { name: 'ZoomTouchPinch', mode: 'active' },
  { name: 'StackScrollMultiTouch', mode: 'active' }
]

export const cursors = [
  {
    label: 'Wwwc',
    value: 'default'
  },
  {
    label: 'Zoom',
    value: 'default'
  },
  {
    label: 'Pan',
    value: 'move'
  },
  {
    label: 'Length',
    value: 'vertical-text'
  },
  {
    label: 'Angle',
    value: 'default'
  },
  {
    label: 'FreehandRoi',
    value: 'default'
  },
  {
    label: 'Eraser',
    value: 'default'
  },
  {
    label: 'Bidirectional',
    value: 'default'
  }
]
