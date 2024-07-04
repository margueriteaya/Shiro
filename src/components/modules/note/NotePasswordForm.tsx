'use client'

import { useState } from 'react'

import { StyledButton } from '~/components/ui/button'
import { Input } from '~/components/ui/input/Input'

export const NotePasswordForm = () => {
  const [password, setPassword] = useState('')
  const handleSubmit: React.EventHandler<React.MouseEvent> = (e) => {
    e.preventDefault()
    window.location.href = `${window.location.href}?password=${password}`
  }
  return (
    <div className="flex h-[calc(100vh-15rem)] flex-col space-y-4 center">
      此內容需要密碼
      <form className="mt-8 flex flex-col space-y-4 center">
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="輸入密碼以檢視"
          aria-label="輸入密碼以檢視"
        />
        <StyledButton
          disabled={!password}
          type="submit"
          variant="primary"
          onClick={handleSubmit}
        >
          檢視
        </StyledButton>
      </form>
    </div>
  )
}
