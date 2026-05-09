import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Session from './pages/Session'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/session" element={<Session />} />
        <Route path="/session/:token" element={<Session />} />
      </Routes>
    </BrowserRouter>
  )
}
