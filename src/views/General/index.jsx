import React from 'react'
import Viewer from './components/Viewer'
import { Alert } from 'antd'

const General = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const url = queryParams.get('url')
  if (url === null) {
    return (
      <Alert
        message={'No se proporcionó un url de imagen dicom'}
        type="error"
        showIcon
      />
    )
  }

  return (
    <div>
      <Viewer url={url} />
    </div>
  )
}

export default General
