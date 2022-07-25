import React, { useContext, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import CornerstoneViewport from 'react-cornerstone-viewport'
import cornerstone from 'cornerstone-core'
import { Button, InputNumber, Space, Spin } from 'antd'
import { ArrowsAltOutlined, BgColorsOutlined, CaretRightOutlined, ColumnWidthOutlined, DeleteOutlined, DragOutlined, FormOutlined, LeftOutlined, PauseOutlined, SearchOutlined, ZoomInOutlined } from '@ant-design/icons'
import api from '../../../api'
import { useQuery } from 'react-query'
import { Context } from '../../../Provider'
import { FloatingPanel, NavBar, List } from 'antd-mobile'
const anchors = [80, window.innerHeight * 0.15, window.innerHeight * 0.9]

const Viewer = ({ dicomId }) => {
  const [play, setPlay] = useState(false)
  const ref = useRef()
  const [active, setActive] = useState('Wwwc')
  const { setDicomId } = useContext(Context)
  const [file, setFile] = useState()
  const [frames, setFrames] = useState(10)
  const queryParams = new URLSearchParams(window.location.search)
  const orden = queryParams.get('orden')
  useQuery(dicomId,
    async () => await api.get(`/user/public/imagen/ordenes/${orden}/attachments/${dicomId}`,
      { responseType: 'blob' }), {
      staleTime: 'Infinity',
      onSuccess: (data) => {
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(
          data.data
        )
        cornerstone.loadImage(imageId).then(image => {
          const frames = image.data.string('x00280008')
          const images = []
          if (frames !== undefined) {
            for (let i = 1; i < frames; i++) {
              images.push(`${imageId}?frame=${i}`)
            }
            setFile(images)
          } else {
            setFile([imageId])
          }
        })
      }
    })

  return (
    <>
    <NavBar back='Regresar'
      right={options.find(x => x.value === active)?.icon}
      onBack={() => setDicomId(undefined)}>
          Visualizador
    </NavBar>

  {
    file
      ? <CornerstoneViewport
    style={
      {
        minWidth: '100%',
        height: 'calc(100vh - 120px)',
        flex: '1'
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
      : <Spin tip={'Cargando imagen...'} style={{ width: '100%' }}/>
}

<FloatingPanel ref={ref} anchors={anchors}>
<List>
  <List.Item>
  <Space>
    <Button icon={<CaretRightOutlined />} onClick={() => setPlay(true)}/>
    <Button icon={<PauseOutlined />} onClick={() => setPlay(false)}/>
    <InputNumber value={frames} onChange={(x) => setFrames(x)} prefix={'fps'}/>
  </Space>
  </List.Item></List>
  <List header='Seleccione una herramienta'>
    {options.map((item, index) => (
      <List.Item
        key={index}
        prefix={item.icon}
        onClick={() => {
          setActive(item.value)
          ref.current.setHeight(80)
        }}
      >{item.label}</List.Item>
    ))}
  </List>
</FloatingPanel>
</>

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

const options = [
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
]
