/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { useEffect, useMemo } from 'react'
import dayjs from 'dayjs'

import { useIsLogged } from '~/atoms/hooks'
import { toast } from '~/lib/toast'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

export const NoteHideIfSecret: Component = ({ children }) => {
  const noteSecret = useCurrentNoteDataSelector((data) => data?.data.publicAt)

  const noteId = useCurrentNoteDataSelector((data) => data?.data.nid)
  const secretDate = useMemo(() => new Date(noteSecret!), [noteSecret])
  const isSecret = noteSecret ? dayjs(noteSecret).isAfter(new Date()) : false

  const isLogged = useIsLogged()

  useEffect(() => {
    if (!noteId) return
    let timer: any
    const timeout = +secretDate - +new Date()
    // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    const MAX_TIMEOUT = (2 ^ 31) - 1
    if (isSecret && timeout && timeout < MAX_TIMEOUT) {
      timer = setTimeout(() => {
        toast('重載以檢視解鎖的文章', 'info', { autoClose: false })
      }, timeout)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isSecret, secretDate, noteId])

  if (!noteId) return null

  if (isSecret) {
    const dateFormat = noteSecret
      ? Intl.DateTimeFormat('zh-tw', {
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
          year: 'numeric',
          day: 'numeric',
          month: 'long',
        }).format(new Date(noteSecret))
      : ''

    if (isLogged) {
      return (
        <>
          <div className="my-6 text-center">
            <p>這是一篇非公開的文章。(將在 {dateFormat} 解鎖)</p>
            <p>現在處於登入狀態，預覽模式：</p>
          </div>
          {children}
        </>
      )
    }
    return (
      <div className="my-6 text-center">
        這篇文章暫時未公開，將會在 {dateFormat} 解鎖，再等等哦
      </div>
    )
  }
  return children
}
