import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import initCornerstone from './initCornerstone.js'
import {
  QueryClient,
  QueryClientProvider
} from 'react-query'
import Provider from './Provider'

const queryClient = new QueryClient()
initCornerstone()
ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Provider>

    <App />
    </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
