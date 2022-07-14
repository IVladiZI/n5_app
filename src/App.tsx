import { useState } from 'react'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './App.css'
import { TablePermission } from './component/table/permission'


function App() {

  const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
  })

  return (
    <ThemeProvider theme={darkTheme}>
    <div className="App">
      <TablePermission/>
    </div>
    </ThemeProvider>
  )
}

export default App
