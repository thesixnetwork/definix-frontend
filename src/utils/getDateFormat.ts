import dayjs from 'dayjs'

const getDateFormat = (language, date, isGmt = true) => {
  if (language === 'ko') {
    return `${dayjs(date).format('YYYY-MM-DD HH:mm:ss')  } ${isGmt ? 'GMT+9' : ''}`
  }
  return `${dayjs(date).format('DD-MMM-YYYY HH:mm:ss')  } ${isGmt ? 'GMT+9' : ''}`
}

export default getDateFormat
