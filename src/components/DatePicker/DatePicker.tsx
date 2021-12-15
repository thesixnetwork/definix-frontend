import React from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { Input, InputProps } from '../../uikit-dev'

import 'react-datepicker/dist/react-datepicker.css'

export interface DatePickerProps extends ReactDatePickerProps {
  inputProps?: InputProps
  showTimeSelect?: any
  showTimeSelectOnly?: any
  timeIntervals?: any
  timeCaption?: any
  dateFormat?: any
  name?: any
  onChange?: any
  selected?: any
  placeholderText?: any
}

const DatePicker: React.FC<DatePickerProps> = ({ inputProps = {}, ...props }) => {
  return (
    <ReactDatePicker
      customInput={<Input style={{ backgroundColor: 'unset' }} {...inputProps} />}
      portalId="reactDatePicker"
      dateFormat="PPP"
      {...props}
    />
  )
}

export default DatePicker
