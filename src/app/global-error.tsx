'use client'

import { useEffect } from 'react'
import { domAnimation, LazyMotion } from 'framer-motion'

// import { captureException } from '@sentry/nextjs'

import { NormalContainer } from '~/components/layout/container/Normal'
import { StyledButton } from '~/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
    // captureException(error)
  }, [error])
  return (
    <html>
      <head>
        <title>禁止存取或者 API 服務出現問題</title>
      </head>
      <body>
        <NormalContainer>
          <h1 className="mb-4">禁止存取或者 API 服務出現問題</h1>
          <div className="flex justify-center">
            <LazyMotion features={domAnimation}>
              <StyledButton onClick={location.reload}>重試</StyledButton>
            </LazyMotion>
          </div>
        </NormalContainer>
      </body>
    </html>
  )
}
