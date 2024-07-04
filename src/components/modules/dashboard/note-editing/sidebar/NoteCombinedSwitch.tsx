import { useState } from 'react'

import { AdvancedInput } from '~/components/ui/input'
import { LabelSwitch } from '~/components/ui/switch'

import { useNoteModelSingleFieldAtom } from '../data-provider'

export const NoteCombinedSwitch = () => {
  const [isHide, setIsHide] = useNoteModelSingleFieldAtom('hide')

  const [allowComment, setAllowComment] =
    useNoteModelSingleFieldAtom('allowComment')

  const [bookmark, setHasMemory] = useNoteModelSingleFieldAtom('bookmark')
  const [password, setPassword] = useNoteModelSingleFieldAtom('password')

  const [passwordEnable, setPasswordEnable] = useState(!!password)

  return (
    <>
      <LabelSwitch
        className="shrink-0"
        checked={isHide}
        onCheckedChange={setIsHide}
      >
        <span>隱藏</span>
      </LabelSwitch>

      <LabelSwitch
        className="shrink-0"
        checked={passwordEnable}
        onCheckedChange={(checked) => {
          setPasswordEnable(checked)
          if (!checked) setPassword('')
        }}
      >
        <span>設定密碼？</span>
      </LabelSwitch>
      {passwordEnable && (
        <AdvancedInput
          color="primary"
          labelPlacement="left"
          labelClassName="text-xs"
          label="密碼"
          type="password"
          inputClassName="text-base font-medium"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      <LabelSwitch
        className="shrink-0"
        checked={allowComment}
        onCheckedChange={setAllowComment}
      >
        <span>允許留言</span>
      </LabelSwitch>

      <LabelSwitch
        className="shrink-0"
        checked={bookmark}
        onCheckedChange={setHasMemory}
      >
        <span>標記為 Memorie</span>
      </LabelSwitch>
    </>
  )
}
