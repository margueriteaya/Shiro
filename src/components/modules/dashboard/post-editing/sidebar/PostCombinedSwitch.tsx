import { LabelSwitch } from '~/components/ui/switch'

import { usePostModelSingleFieldAtom } from '../data-provider'

export const PostCombinedSwitch = () => {
  const [copyright, setCopyright] = usePostModelSingleFieldAtom('copyright')
  const [pin, setPin] = usePostModelSingleFieldAtom('pin')

  const [allowComment, setAllowComment] =
    usePostModelSingleFieldAtom('allowComment')

  return (
    <>
      <LabelSwitch
        checked={copyright}
        label="著作權資訊"
        onCheckedChange={setCopyright}
      />

      <LabelSwitch
        checked={!!pin}
        onCheckedChange={(pin) => {
          setPin(pin ? new Date().toISOString() : null)
        }}
      >
        <span>置頂</span>
      </LabelSwitch>

      <LabelSwitch checked={allowComment} onCheckedChange={setAllowComment}>
        <span>允許留言</span>
      </LabelSwitch>
    </>
  )
}
