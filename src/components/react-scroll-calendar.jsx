import React, { Component } from 'react'
import moment from 'moment'
import lockdownimg from '../lockdown.jpg'
import hesuanimg from '../hesuan.jpg'
import './index.css'

function isSameDate(firstDate, secondDate) {
  return (
    moment(firstDate, 'DD/MM/YYYY').diff(
      moment(secondDate, 'DD/MM/YYYY'),
      'days',
      false,
    ) === 0
  )
}

function isDisabled(minDate, currentDate, maxDate) {
  let min = moment(moment(minDate).format('DD/MM/YYYY'), 'DD/MM/YYYY')
  let max = moment(moment(maxDate).format('DD/MM/YYYY'), 'DD/MM/YYYY')
  let current = moment(moment(currentDate).format('DD/MM/YYYY'), 'DD/MM/YYYY')
  return !(min <= current && current <= max)
}

export default class ScrollCalendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDate: null,
    }

    this.handleSelectedDate = this.handleSelectedDate.bind(this)
    this.setSelectedDate = this.setSelectedDate.bind(this)
  }

  handleSelectedDate(e, value) {
    e && e.preventDefault()
    this.setSelectedDate(value)
    if (this.props.onSelect) {
      this.props.onSelect(value)
    }
  }

  setSelectedDate(date) {
    this.setState({
      selectedDate: date,
    })
  }

  componentDidMount() {
    this.setSelectedDate(this.props.selectedDate)
    let element = document.getElementById(
      moment(this.props.selectedDate, 'DD/MMM/YYYY').format('MMMM-YYYY'),
    )
    if (element) {
      element.scrollIntoView()
    }
  }

  componentWillReceiveProps(props) {
    if (props.selectedDate) {
      this.setSelectedDate(props.selectedDate)
    }
  }

  render() {
    let props = {
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      selectedDate: this.state.selectedDate,
      handleSelect: this.handleSelectedDate,
      className: this.props.className + ' mobile-datepicker',
      yearFormat: this.props.yearFormat,
      monthFormat: this.props.monthFormat,
      enableYearTitle: this.props.enableYearTitle,
      enableMonthTitle: this.props.enableMonthTitle,
      list: this.props.list,
    }
    return <RenderCalendarYear {...props} />
  }
}

export const RenderCalendarYear = (props) => {
  let { minDate, maxDate } = props
  let totalMonth = Math.round(maxDate.diff(minDate, 'months', true)) + 1
  let now = moment(minDate, 'DD/MMM/YYYY')
  let elements = []
  for (let i = 0; i < totalMonth; i++) {
    elements.push(
      <RenderMonthCard key={i} currentMonth={now.clone()} {...props} />,
    )
    now = now.add(1, 'M')
  }
  return <div className={props.className}>{elements}</div>
}

export const RenderMonthCard = (props) => {
  let now = props.currentMonth
  return (
    <section className="month" id={now.format('MMMM-YYYY')}>
      <RenderMonthHeader date={now} {...props} />
      <RenderDayHeader />
      <RenderDays date={now} {...props} />
    </section>
  )
}

export const RenderMonthHeader = (props) => {
  let month = props.date.format(props.monthFormat)
  let year = props.date.format(props.yearFormat)

  return (
    <p className="month-title">
      {props.enableYearTitle ? <span>{year}</span> : null}
      {props.enableMonthTitle ? month : null}
    </p>
  )
}

export const RenderDayHeader = () => {
  return (
    <ul className="days">
      <li key={'Sunday'}>日</li>
      <li key={'Monday'}>一</li>
      <li key={'Tuesday'}>二</li>
      <li key={'Wednesday'}>三</li>
      <li key={'Thursday'}>四</li>
      <li key={'Friday'}>五</li>
      <li key={'Saturday'}>六</li>
    </ul>
  )
}

export const RenderSingleDay = ({
  isActive,
  handleClick,
  currentValue,
  isDisabled,
  list,
  i,
}) => {
  let className =
    '' + (isActive ? 'active' : '') + (isDisabled ? 'disabled' : '')

  const LockdownView = () => {
    return <img src={lockdownimg} width="40" height={40} alt="lockdownimg" />
  }
  const AetectionView = () => {
    return <img src={hesuanimg} width="40" height={40} alt="lockdownimg" />
  }

  const cur = list.find((item) => item.key == +currentValue)
  const status = cur ? cur.status : 0

  return (
    <li
      className={className}
      key={i}
      onClick={(e) => handleClick(e, currentValue)}
    >
      {(status === 0 || !status) && <span>{currentValue.date()}</span>}
      {status === 1 && <LockdownView />}
      {status === 2 && <AetectionView />}
    </li>
  )
}

export const RenderDays = ({
  date,
  selectedDate,
  handleSelect,
  minDate,
  maxDate,
  list,
}) => {
  let daysInMonth = date.daysInMonth()
  let startDate = date.startOf('month')
  let balanceDayCount = startDate.day()

  let renderDay = () => {
    let elements = []
    let now = moment(date, 'DD/MMM/YYYY')
    for (let i = 1; i <= daysInMonth; i++) {
      const { isLockdown, isAetection } = list.find(
        (item) => item.key === +now,
      ) || { isLockdown: false, isAetection: false }
      elements.push(
        <RenderSingleDay
          isActive={isSameDate(now.clone(), selectedDate)}
          isDisabled={isDisabled(minDate, now.clone(), maxDate)}
          handleClick={handleSelect}
          currentValue={now.clone()}
          key={i}
          list={list}
          isLockdown={isLockdown}
          isAetection={isAetection}
        />,
      )
      now = now.add(1, 'days')
    }
    return elements
  }
  let renderUnwantedDay = (balanceDayCount) => {
    let elements = []
    for (let i = 0; i < balanceDayCount; i++) {
      elements.push(<li className="visible-hidden" key={i} />)
    }
    return elements
  }
  return (
    <ul className="date">
      {renderUnwantedDay(balanceDayCount)}
      {renderDay()}
    </ul>
  )
}
