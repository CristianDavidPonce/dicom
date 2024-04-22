import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const Context = createContext({})

const Provider = ({ children }) => {
  const [dicom, setDicom] = useState()
  const [dicomId, setDicomId] = useState()

  return (
    <Context.Provider
      value={{
        dicom,
        setDicom,
        dicomId,
        setDicomId,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Provider
Provider.propTypes = {
  children: PropTypes.node,
}
