import React from 'react'
import Lottie from 'react-lottie'
import loading from 'uikit-dev/animation/loading.json'

const options = {
  loop: true,
  autoplay: true,
  animationData: loading,
}

const Loading = ({ width = 150, height = 150 }) => {
  return <Lottie options={options} height={height} width={width} />
}
export default Loading
