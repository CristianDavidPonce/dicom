import React, { useContext, useState } from 'react'
import { useQuery } from 'react-query'
import api from '../../../api'
import PropTypes from 'prop-types'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import CornerstoneViewport from 'react-cornerstone-viewport'
import { Progress, Spin } from 'antd'
import { Context } from '../../../Provider'

const LeftMenuItem = ({ dicomId, firstDicom }) => {
  const queryParams = new URLSearchParams(window.location.search)
  const { setDicom, dicom, setDicomId } = useContext(Context)
  const orden = queryParams.get('orden')
  const [file, setFile] = useState()
  const [progress, setProgress] = useState(0)
  const item = useQuery(dicomId,
    async () => await api.get(`/user/public/imagen/ordenes/${orden}/attachments/${dicomId}`,
      {
        responseType: 'blob',
        onDownloadProgress: (x) => {
          setProgress(Math.round(
            (x.loaded * 100) / x.total
          ))
        }
      }), {
      staleTime: 'Infinity',
      onSuccess: (data) => {
        const datos = dicom || []
        if (dicom?.some(x => x._id === dicomId)) {
          console.log('hola')
        } else {
          datos.push({ _id: dicomId, data: data.data })
          setDicom(datos)
        }
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(
          data.data
        )
        setFile(imageId)
        if (firstDicom === dicomId) {
          console.log('ok21')
          setDicomId(dicomId)
        }
      }
    })
  return (
    <Spin spinning={item.isLoading} style={{ width: '180px' }} tip={<Progress percent={progress}/>}>
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
  dicomId: PropTypes.string,
  firstDicom: PropTypes.string
}
