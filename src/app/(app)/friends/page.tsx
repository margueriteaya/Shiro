/* eslint-disable react/jsx-no-target-blank */
'use client'

import { useQuery } from '@tanstack/react-query'
import { memo, useCallback, useRef, useState } from 'react'
import { m } from 'framer-motion'
import Markdown from 'markdown-to-jsx'
import type { LinkModel } from '@mx-space/api-client'
import type { FormContextType } from '~/components/ui/form'
import type { FC } from 'react'

import { LinkState, LinkType, RequestError } from '@mx-space/api-client'

import { NotSupport } from '~/components/common/NotSupport'
import { Avatar } from '~/components/ui/avatar'
import { StyledButton } from '~/components/ui/button'
import { Collapse } from '~/components/ui/collapse'
import { BackToTopFAB } from '~/components/ui/fab'
import { Form, FormInput } from '~/components/ui/form'
import { FullPageLoading } from '~/components/ui/loading'
import { useModalStack } from '~/components/ui/modal'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { shuffle } from '~/lib/lodash'
import { apiClient } from '~/lib/request'
import { getErrorMessageFromRequestError } from '~/lib/request.shared'
import { toast } from '~/lib/toast'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

const renderTitle = (text: string) => {
  return <h1 className="!my-12 !text-xl font-bold">{text}</h1>
}

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data } = await apiClient.link.getAll()
      return data
    },
    select: useCallback((data: LinkModel[]) => {
      const friends: LinkModel[] = []
      const collections: LinkModel[] = []
      const outdated: LinkModel[] = []
      const banned: LinkModel[] = []

      for (const link of data) {
        if (link.hide) {
          continue
        }

        switch (link.state) {
          case LinkState.Banned:
            banned.push(link)
            continue
          case LinkState.Outdate:
            outdated.push(link)
            continue
        }

        switch (link.type) {
          case LinkType.Friend: {
            friends.push(link)
            break
          }
          case LinkType.Collection: {
            collections.push(link)
          }
        }
      }

      return { friends: shuffle(friends), collections, outdated, banned }
    }, []),
  })

  if (isLoading) return <FullPageLoading />
  if (!data) return null
  const { banned, collections, friends, outdated } = data
  return (
    <div>
      <header className="prose prose-p:my-2">
        <h1>朋友們</h1>
        <h3>価値は命に従って付いてる</h3>
      </header>

      <main className="mt-10 flex w-full flex-col">
        {friends.length > 0 && (
          <>
            {collections.length !== 0 && renderTitle('我的朋友')}
            <FriendSection data={friends} />
          </>
        )}
        {collections.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('我的收藏')}
            <FavoriteSection data={collections} />
          </>
        )}

        {outdated.length > 0 && (
          <>
            <Collapse
              title={
                <div className="mt-8 font-bold">以下站點無法訪問，已失聯</div>
              }
            >
              <OutdateSection data={outdated} />
            </Collapse>
          </>
        )}
        {banned.length > 0 && (
          <>
            <Collapse
              title={
                <div className="mt-8 font-bold">以下站點不合規，已被禁止</div>
              }
            >
              <BannedSection data={banned} />
            </Collapse>
          </>
        )}
      </main>

      <ApplyLinkInfo />
      <BackToTopFAB />
    </div>
  )
}
type FriendSectionProps = {
  data: LinkModel[]
}

const FriendSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <section className="grid grid-cols-2 gap-6 md:grid-cols-3 2xl:grid-cols-3">
      {data.map((link) => {
        return (
          <BottomToUpTransitionView key={link.id} duration={50}>
            <Card link={link} />
          </BottomToUpTransitionView>
        )
      })}
    </section>
  )
}

const LayoutBg = memo(() => {
  return (
    <m.span
      layoutId="bg"
      className="absolute -inset-2 z-[-1] rounded-md bg-slate-200/80 dark:bg-neutral-600/80"
      initial={{ opacity: 0.8, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { delay: 0.2 } }}
    />
  )
})
LayoutBg.displayName = 'LayoutBg'

const Card: FC<{ link: LinkModel }> = ({ link }) => {
  const [enter, setEnter] = useState(false)

  return (
    <m.a
      layoutId={link.id}
      href={link.url}
      target="_blank"
      role="link"
      aria-label={`Go to ${link.name}'s website`}
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
      rel="noreferrer"
    >
      {enter && <LayoutBg />}

      <Avatar
        randomColor
        imageUrl={link.avatar}
        lazy
        radius={8}
        text={link.name[0]}
        alt={`Avatar of ${link.name}`}
        size={64}
        className="ring-2 ring-gray-400/30 dark:ring-zinc-50"
      />
      <span className="flex h-full flex-col items-center justify-center space-y-2 py-3">
        <span className="text-lg font-medium">{link.name}</span>
        <span className="line-clamp-2 text-balance break-all text-center text-sm text-base-content/80">
          {link.description}
        </span>
      </span>
    </m.a>
  )
}

const FavoriteSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul className="relative flex w-full grow flex-col gap-4">
      {data.map((link) => {
        return (
          <li key={link.id} className="flex w-full items-end">
            <a
              href={link.url}
              target="_blank"
              className="shrink-0 text-base leading-none"
              rel="noreferrer"
            >
              {link.name}
            </a>

            <span className="ml-2 h-[12px] max-w-full truncate break-all text-xs leading-none text-base-content/80">
              {link.description || ''}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

const OutdateSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul className="space-y-1 p-4 opacity-80">
      {data.map((link) => {
        return (
          <li key={link.id}>
            <span className="cursor-not-allowed font-medium">{link.name}</span>
            <span className="ml-2 text-sm">{link.description || ''}</span>
          </li>
        )
      })}
    </ul>
  )
}

const BannedSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul className="space-y-1 p-4 opacity-40">
      {data.map((link) => {
        return (
          <li key={link.id}>
            <span className="cursor-not-allowed">{link.name}</span>
          </li>
        )
      })}
    </ul>
  )
}

const ApplyLinkInfo: FC = () => {
  const {
    seo,
    user: { avatar, name },
  } = useAggregationSelector((a) => ({
    seo: a.seo!,
    user: a.user!,
  }))!

  const { data: canApply } = useQuery({
    queryKey: ['can-apply'],
    queryFn: () => apiClient.link.canApplyLink(),
    initialData: true,
    refetchOnMount: 'always',
  })
  const { present } = useModalStack()
  if (!canApply) {
    return <NotSupport className="mt-20" text="主人禁止了申請友鏈。" />
  }
  return (
    <>
      <div className="prose mt-20">
        <Markdown>
          {[
            `- 您有權利在申請友鏈後不在您的友鏈頁追加本站，是朋友比什麼都重要。`,
            `- 確保您的網站不存在歧視女性、性小衆群體、順直本位與男本位主義、漢本位主義、親中東與親建制派內容。`,
            `- 為了您的安全著想，禁止任何有中國ICP備案或有申請ICP備案計畫的網站申請友鏈。`,
            `- 若您無法提供HTTPS的連結，申請過程會出現問題。這種限制並不在我的意願之內，但我無法解決。`,
            `- 為了保證純鼠空間的純潔性，不允許養殖系流量殭屍網站申請友鏈。並且，出售域名用作商業用途將被清除。`,
          ].join('\n\n')}
        </Markdown>
        <Markdown className="[&_p]:!my-1">
          {[
            '',
            `**站點標題**: [${
              seo.title
            }](${`${location.protocol}//${location.host}`})`,
            `**站點描述**: ${seo.description}`,
            `**主人頭像**: [下載](${avatar})`,
            `**主人名字**: ${name}`,
          ].join('\n\n')}
        </Markdown>
      </div>

      <StyledButton
        variant="primary"
        className="mt-5"
        onClick={() => {
          present({
            title: 'Be water',

            content: () => <FormModal />,
          })
        }}
      >
        握手！
      </StyledButton>
    </>
  )
}

const FormModal = () => {
  const { dismissTop } = useModalStack()
  const [inputs] = useState(() => [
    {
      name: 'author',
      placeholder: '昵稱 *',
      rules: [
        {
          validator: (value: string) => !!value,
          message: '昵稱不能為空',
        },
        {
          validator: (value: string) => value.length <= 20,
          message: '昵稱不能超過20個字符',
        },
      ],
    },
    {
      name: 'name',
      placeholder: '站點標題 *',
      rules: [
        {
          validator: (value: string) => !!value,
          message: '站點標題不能為空',
        },
        {
          validator: (value: string) => value.length <= 20,
          message: '站點標題不能超過20個字符',
        },
      ],
    },
    {
      name: 'url',
      placeholder: '網站 * https://',
      rules: [
        {
          validator: isHttpsUrl,
          message: '請輸入正確的網站連結 https://',
        },
      ],
    },
    {
      name: 'avatar',
      placeholder: '圖標連結 * https://',
      rules: [
        {
          validator: isHttpsUrl,
          message: '請輸入正確的圖標連結 https://',
        },
      ],
    },
    {
      name: 'email',
      placeholder: '留下你的信箱哦 *',

      rules: [
        {
          validator: isEmail,
          message: '請輸入正確的信箱',
        },
      ],
    },
    {
      name: 'description',
      placeholder: '一句話描述一下自己吧 *',

      rules: [
        {
          validator: (value: string) => !!value,
          message: '一句話描述一下自己吧',
        },
        {
          validator: (value: string) => value.length <= 50,
          message: '一句話描述不要超過50個字啦',
        },
      ],
    },
  ])

  const formRef = useRef<FormContextType>(null)

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault()
      const currentValues = formRef.current?.getCurrentValues()
      if (!currentValues) return

      apiClient.link
        .applyLink({ ...(currentValues as any) })
        .then(() => {
          dismissTop()
          toast.success('好了')
        })
        .catch((err) => {
          if (err instanceof RequestError)
            toast.error(getErrorMessageFromRequestError(err))
          else {
            toast.error(err.message)
          }
        })
    },
    [dismissTop],
  )

  return (
    <Form
      ref={formRef}
      className="w-full space-y-4 text-center lg:w-[300px]"
      onSubmit={handleSubmit}
    >
      {inputs.map((input) => (
        <FormInput key={input.name} {...input} />
      ))}

      <StyledButton variant="primary" type="submit">
        好唄
      </StyledButton>
    </Form>
  )
}

const isHttpsUrl = (value: string) => {
  return (
    /^https?:\/\/.*/.test(value) &&
    (() => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    })()
  )
}

const isEmail = (value: string) => {
  return /^.+@.+\..+$/.test(value)
}
