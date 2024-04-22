import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import CornerstoneViewport from 'react-cornerstone-viewport'
import cornerstone from 'cornerstone-core'
import { Button, InputNumber, Progress, Space, Spin } from 'antd'
import {
  ArrowsAltOutlined,
  BgColorsOutlined,
  CaretRightOutlined,
  ColumnWidthOutlined,
  DeleteOutlined,
  DragOutlined,
  FormOutlined,
  LeftOutlined,
  PauseOutlined,
  SearchOutlined,
  ZoomInOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import { useQuery } from 'react-query'

import { FloatingPanel, NavBar, List } from 'antd-mobile'
const anchors = [80, window.innerHeight * 0.15, window.innerHeight * 0.9]

const Viewer = ({ url }) => {
  const [play, setPlay] = useState(false)
  const ref = useRef()
  const [active, setActive] = useState('Wwwc')

  const [file, setFile] = useState()
  const [frames, setFrames] = useState(10)

  const [progress, setProgress] = useState(0)
  useQuery(
    'key',
    async () =>
      await axios.get(url, {
        responseType: 'blob',
        onDownloadProgress: (x) => {
          setProgress(Math.round((x.loaded * 100) / x.total))
        },
      }),
    {
      staleTime: 'Infinity',
      onSuccess: (data) => {
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(
          data.data
        )
        cornerstone.loadImage(imageId).then((image) => {
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
      },
      enabled: url !== undefined,
    }
  )

  return (
    <>
      <NavBar right={options.find((x) => x.value === active)?.icon}>
        Visualizador
      </NavBar>
      {file ? (
        <CornerstoneViewport
          style={{
            minWidth: '100%',
            height: 'calc(100vh - 120px)',
            flex: '1',
          }}
          imageIds={file}
          tools={toolsInit}
          activeTool={active}
          frameRate={frames}
          isPlaying={play}
        />
      ) : (
        <Spin
          tip={
            <>
              <div>Cargando imagen...</div>
              <Progress percent={progress} />
            </>
          }
          style={{ width: '100%', height: '100%' }}
        />
      )}

      <FloatingPanel ref={ref} anchors={anchors}>
        <List>
          <List.Item>
            <Space>
              <Button
                icon={<CaretRightOutlined />}
                onClick={() => setPlay(true)}
              />
              <Button icon={<PauseOutlined />} onClick={() => setPlay(false)} />
              <InputNumber
                value={frames}
                onChange={(x) => setFrames(x)}
                prefix={'fps'}
              />
            </Space>
          </List.Item>
        </List>
        <List header="Seleccione una herramienta">
          {options.map((item, index) => (
            <List.Item
              key={index}
              prefix={item.icon}
              onClick={() => {
                setActive(item.value)
                ref.current.setHeight(80)
              }}
            >
              {item.label}
            </List.Item>
          ))}
        </List>
      </FloatingPanel>
    </>
  )
}

export default Viewer
Viewer.propTypes = {
  url: PropTypes.string,
}

const toolsInit = [
  // Mouse
  {
    name: 'Wwwc',
    mode: 'active',
    modeOptions: { mouseButtonMask: 1 },
  },
  {
    name: 'Zoom',
    mode: 'active',
    modeOptions: { mouseButtonMask: 2 },
  },
  {
    name: 'Pan',
    mode: 'active',
    modeOptions: { mouseButtonMask: 4 },
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
  { name: 'StackScrollMultiTouch', mode: 'active' },
]

export const cursors = [
  {
    label: 'Wwwc',
    value: 'default',
  },
  {
    label: 'Zoom',
    value: 'default',
  },
  {
    label: 'Pan',
    value: 'move',
  },
  {
    label: 'Length',
    value: 'vertical-text',
  },
  {
    label: 'Angle',
    value: 'default',
  },
  {
    label: 'FreehandRoi',
    value: 'default',
  },
  {
    label: 'Eraser',
    value: 'default',
  },
  {
    label: 'Bidirectional',
    value: 'default',
  },
]

const options = [
  {
    label: 'Brillo/Contraste',
    value: 'Wwwc',
    icon: <BgColorsOutlined />,
  },
  {
    label: 'Zoom',
    value: 'Zoom',
    icon: <ZoomInOutlined />,
  },
  {
    label: 'Arrastrar',
    value: 'Pan',
    icon: <DragOutlined />,
  },
  {
    label: 'Agrandar cuadro',
    value: 'Magnify',
    icon: <SearchOutlined />,
  },
  {
    label: 'Regla',
    value: 'Length',
    icon: <ColumnWidthOutlined />,
  },
  {
    label: 'Ángulo',
    value: 'Angle',
    icon: <LeftOutlined />,
  },
  {
    label: 'Bidireccional',
    value: 'Bidirectional',
    icon: <ArrowsAltOutlined />,
  },
  {
    label: 'Dibujar área',
    value: 'FreehandRoi',
    icon: <FormOutlined />,
  },
  {
    label: 'Borrador',
    value: 'Eraser',
    icon: <DeleteOutlined />,
  },
]
