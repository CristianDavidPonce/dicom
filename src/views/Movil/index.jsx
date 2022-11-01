import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Alert, Descriptions, Drawer, Skeleton } from 'antd'
import api from '../../api'
import { Context } from '../../Provider'
import moment from 'moment'
import { Collapse, List } from 'antd-mobile'
import { EyeOutline } from 'antd-mobile-icons'
import Viewer from './components/Viewer'
const { Item } = Descriptions
document.documentElement.setAttribute(
  'data-prefers-color-scheme',
  'dark'
)
const Movil = () => {
  useEffect(() => {
    document.title = 'Dicom Viewer'
  }, [])
  const queryParams = new URLSearchParams(window.location.search)
  const orden = queryParams.get('orden')
  const [drawer, setDrawer] = useState(false)
  const { setDicomId, dicomId } = useContext(Context)
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
  return (

<>

        {
          lista.isLoading
            ? <Skeleton/>
            : (dicomId === undefined
                ? <> <List header='Seleccione una imagen'>

           { lista.data?.data.filter(x => x.mimetype === 'application/octet-stream').map(x =>
              <List.Item key={x._id}
              prefix={<EyeOutline/>}
              onClick={() => setDicomId(x._id)}
              >{x.name}</List.Item>

           )}
             </List>
             <List header='Informe'></List>
             <Collapse>
              <Collapse.Panel key='1' title='Informe'>
                <p style={{ whiteSpace: 'break-spaces' }}>
                  {result?.data?.data?.result?.orden?.informe}
                  </p>
              </Collapse.Panel>
              <Collapse.Panel key='2' title='Conclusión'>
              <p style={{ whiteSpace: 'break-spaces' }}>

                {result?.data?.data?.result?.orden?.conclusion}
              </p>
              </Collapse.Panel>
            </Collapse>
             </>
                : <Viewer dicomId={dicomId}/>)

    }

      <Drawer visible={drawer} placement='right' onClose={() => setDrawer(false)}>
      <Descriptions layout='vertical' bordered size='small'>
      <Item label='Profesional' span={3}>{result?.data?.data?.result?.doctor?.completeName}</Item>
      <Item label='Paciente' span={3}>{result?.data?.data?.result?.patient?.completeName}</Item>
      <Item label='Fecha' span={3}>{result?.data?.data?.result?.date && moment(result?.attention?.date).format('YYYY-MM-DD')}</Item>
      <Item label='Servicio' span={3}>{result?.data?.data?.result?.services?.map(x => <>
      {x.descripcion}
      <br />
      </>)}</Item>
      <Item label='Infome' span={3}>{result?.data?.data?.result?.orden?.informe}</Item>
      <Item label='Conclusión' span={3}>{result?.data?.data?.result?.orden?.conclusion}</Item>
    </Descriptions>
      </Drawer>

</>
  )
}

export default Movil
