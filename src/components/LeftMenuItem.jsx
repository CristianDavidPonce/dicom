import React, { useState } from 'react'
import { useQuery } from 'react-query'
import api from '../api'
import PropTypes from 'prop-types'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import CornerstoneViewport from 'react-cornerstone-viewport'
import { Spin } from 'antd'

const LeftMenuItem = ({ dicomId }) => {
  const queryParams = new URLSearchParams(window.location.search)
  const orden = queryParams.get('orden')
  const [file, setFile] = useState()
  const item = useQuery(dicomId,
    async () => await api.get(`/user/public/imagen/ordenes/${orden}/attachments/${dicomId}`,
      { responseType: 'blob' }), {
      enabled: !!dicomId,
      staleTime: 'Infinity',
      onSuccess: (data) => {
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(
          data.data
        )
        setFile(imageId)
      }
    })
  return (
    <Spin spinning={item.isLoading} style={{ width: '180px' }}>
     { file &&
      <CornerstoneViewport
        style={
          {
            width: '180px',
            height: '180px'
          }
        }
        imageIds={
          [file]
        }
        viewportOverlayComponent={() => (
          <></>
        )}
        />
      }
    </Spin>
  )
}

export default LeftMenuItem

LeftMenuItem.propTypes = {
  dicomId: PropTypes.string
}
