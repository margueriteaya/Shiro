import type { FC } from 'react'

export const BizErrorPage: FC<{
  bizMessage: string
  status: number
}> = ({ bizMessage, status }) => {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col center">
      <h2 className="mb-5 flex flex-col gap-2 text-center">
        <p>資料埠請求出現錯誤</p>
        <p>
          HTTP Status: <strong>{status}</strong>
        </p>
        <p>
          錯誤資訊：<strong>{bizMessage}</strong>
        </p>
      </h2>
    </div>
  )
}
