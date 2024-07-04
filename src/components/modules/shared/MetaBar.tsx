import type { FC } from 'react'

import { useCurrentRoomCount } from '~/atoms/hooks'
import { FloatPopover } from '~/components/ui/float-popover'

import { useMaybeInRoomContext } from '../activity'

export const CurrentReadingCountingMetaBarItem: FC<{
  leftElement?: React.ReactNode
}> = ({ leftElement }) => {
  const roomCtx = useMaybeInRoomContext()

  const count = useCurrentRoomCount(roomCtx?.roomName || '')

  if (!roomCtx || count <= 1) return null

  return (
    <>
      {leftElement}
      <FloatPopover
        asChild
        mobileAsSheet
        type="tooltip"
        triggerElement={
          <span>
            當前<span className="mx-1 font-medium">{count}</span>人正在閱覽
          </span>
        }
      >
        當前線上的閱覽人數，可以透過左側時間線檢視其他人的閱覽進度（行動裝置上無法檢視）
      </FloatPopover>
    </>
  )
}
