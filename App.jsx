import React, { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'

export default function App() {
  const [cards, setCards] = useState([])
  const [order, setOrder] = useState([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [unknowns, setUnknowns] = useState(new Set())
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (cards.length === 0) return
    const arr = Array.from({ length: cards.length }, (_, i) => i)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setOrder(arr)
  }, [cards])

  const handleFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
      const parsed = json.map(r => ({ lat: r[0], cz: r[1] })).filter(r => r.lat || r.cz)
      setCards(parsed)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6'>
      <div className='max-w-2xl w-full'>
        <h1 className='text-3xl font-extrabold mb-6 text-center'>Zkoušečka slovíček — latina</h1>
        <input ref={fileInputRef} onChange={(e)=>handleFile(e.target.files[0])} type='file' accept='.xlsx,.xls' />
      </div>
    </div>
  )
}