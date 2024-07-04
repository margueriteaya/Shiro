import { EmptyIcon } from '~/components/icons/empty'
import { NormalContainer } from '~/components/layout/container/Normal'

export const NothingFound: Component = () => {
  return (
    <NormalContainer className="flex h-[500px] flex-col space-y-4 center [&_p]:my-4">
      <EmptyIcon />
      <p>這裡空空如也</p>
      <p>稍後再來看看吧！</p>
    </NormalContainer>
  )
}
