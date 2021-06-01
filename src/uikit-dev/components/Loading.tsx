import React from 'react'
import Lottie from 'react-lottie'
import loading from 'uikit-dev/animation/loading.json'

const options = {
  loop: true,
  autoplay: true,
  animationData: loading,
}

const Loading = () => {
  return <Lottie options={options} height={200} width={200} />
}
export default Loading
