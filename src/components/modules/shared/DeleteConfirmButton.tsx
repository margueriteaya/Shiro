import type { FC, PropsWithChildren } from 'react'

import { MotionButtonBase, StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { toast } from '~/lib/toast'

export const DeleteConfirmButton: FC<
  {
    onDelete: () => Promise<any>
    confirmText?: string
    deleteItemText?: string
  } & PropsWithChildren
> = (props) => {
  const { onDelete, confirmText, deleteItemText } = props

  const defaultButton = (
    <StyledButton
      variant="secondary"
      className="rounded-lg"
      onClick={() => {
        onDelete().then(() => {
          toast.success('刪除成功')
        })
      }}
    >
      確定
    </StyledButton>
  )

  return (
    <FloatPopover
      trigger="click"
      type="tooltip"
      triggerElement={
        <MotionButtonBase className="duration-200 hover:text-red-500">
          刪除
        </MotionButtonBase>
      }
    >
      <div className="flex p-2">
        <p className="text-center text-base font-bold text-error">
          {confirmText ??
            (deleteItemText
              ? `確定刪除「${deleteItemText}」嗎？`
              : '確定刪除嗎？')}
        </p>
      </div>
      <div className="text-right">{props.children || defaultButton}</div>
    </FloatPopover>
  )
}
