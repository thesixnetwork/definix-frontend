import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 26.5 26.5" {...props}>
      <path
        d="M144,140a4,4,0,1,0-1.172,2.828A3.854,3.854,0,0,0,144,140Zm8-1.7v3.469a.6.6,0,0,1-.125.359.475.475,0,0,1-.312.2l-2.891.438a10.011,10.011,0,0,1-.609,1.422q.547.781,1.672,2.156a.6.6,0,0,1,.156.391.521.521,0,0,1-.141.359,15.868,15.868,0,0,1-1.547,1.688q-1.125,1.109-1.469,1.109a.763.763,0,0,1-.406-.141l-2.156-1.687a8.911,8.911,0,0,1-1.422.594,25.574,25.574,0,0,1-.453,2.906.526.526,0,0,1-.563.438h-3.469a.591.591,0,0,1-.383-.133.463.463,0,0,1-.18-.336l-.437-2.875a9.659,9.659,0,0,1-1.406-.578l-2.2,1.672a.562.562,0,0,1-.391.141.539.539,0,0,1-.391-.172,20.613,20.613,0,0,1-2.578-2.625.611.611,0,0,1-.109-.359.6.6,0,0,1,.125-.359q.234-.328.8-1.039t.844-1.1a7.729,7.729,0,0,1-.641-1.547l-2.859-.422a.492.492,0,0,1-.328-.2A.591.591,0,0,1,128,141.7v-3.469a.6.6,0,0,1,.125-.359.471.471,0,0,1,.3-.2l2.906-.437a7.717,7.717,0,0,1,.609-1.437q-.625-.891-1.672-2.156a.587.587,0,0,1-.156-.375.659.659,0,0,1,.141-.359,15.511,15.511,0,0,1,1.539-1.68q1.133-1.117,1.477-1.117a.665.665,0,0,1,.406.156l2.156,1.672a8.909,8.909,0,0,1,1.422-.594,25.558,25.558,0,0,1,.453-2.906.526.526,0,0,1,.563-.438h3.469a.591.591,0,0,1,.383.133.463.463,0,0,1,.18.336l.437,2.875a9.658,9.658,0,0,1,1.406.578l2.219-1.672a.507.507,0,0,1,.375-.141.6.6,0,0,1,.391.156,21.369,21.369,0,0,1,2.578,2.656.5.5,0,0,1,.109.344.6.6,0,0,1-.125.359q-.234.328-.8,1.039t-.844,1.1a9.416,9.416,0,0,1,.641,1.531l2.859.438a.492.492,0,0,1,.328.2A.591.591,0,0,1,152,138.3Z"
        transform="translate(-126.75 -126.75)"
        fill="none"
        // stroke="#0973b9"
        strokeWidth="2"
      />
    </Svg>
  )
}

export default Icon
