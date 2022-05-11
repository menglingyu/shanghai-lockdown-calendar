import logo from './logo.svg'
import './App.css'
import React, { Component, useEffect, useState } from 'react'
import MobileCalendar from './components/react-scroll-calendar'
import moment from 'moment'

function readLocal() {
  const res = localStorage.getItem('list')
  return res ? JSON.parse(res) : []
}

function setLocal(list) {
  localStorage.setItem('list', JSON.stringify(list))
}

function App() {
  const [list, setList] = useState([])

  function handleClick(date) {
    let newList = [...list]
    const index = list.findIndex((item) => item.key === +date)
    let newDate = { key: +date, status: 1 }

    if (index > -1) {
      newDate = { ...newList[index] }
      switch (newDate.status) {
        case undefined:
          newDate.status = 1
        case 0:
        case 1:
          newDate.status = newDate.status + 1
          break
        case 2:
          newDate.status = 0
        default:
          break
      }
      newList[index] = newDate
    } else {
      newList = [...newList, newDate]
    }
    setList(newList)
    setLocal(newList)
  }

  useEffect(() => {
    const res = readLocal()

    if (res) {
      setList(res)
    }
  }, [])

  return (
    <div className="App">
      <h1>上海封城日历</h1>
      <MobileCalendar
        minDate={moment('2022-01-01', 'YYYY-MM-DD')}
        selectedDate={moment().startOf('day')}
        maxDate={moment('2022-08-01', 'YYYY-MM-DD')}
        onSelect={handleClick}
        list={list}
        monthFormat="YYYY-MM"
        enableMonthTitle={true}
      />
    </div>
  )
}

export default App
