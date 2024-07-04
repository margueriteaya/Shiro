import { redirect } from 'next/navigation'

import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

export default definePrerenderPage<{
  category: string
}>()({
  fetcher({ category }) {
    return apiClient.post.getFullUrl(category)
  },
  Component({ data }) {
    redirect(`/posts${data.path}`)

    return (
      <div>
        正在移動至 <pre>{`/posts${data.path}`}</pre>
      </div>
    )
  },
})
