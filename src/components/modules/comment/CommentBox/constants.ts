import { sample } from '~/lib/lodash'

const placeholderCopywrites = [
  '可講可不講。',
  '或許此地可以留下足跡',
  '說點什麼吧，我會好好聽的。',
  '附近的星球來自於回聲，沼澤來自於地面的失眠。',
  '冇有了剃刀就封鎖語言，沒有了心髒卻活了九年。',
  '心裡的蜘蛛模仿人類張燈結彩，攜帶樂器的遊民也無法傳達。',
  '我所了解的孤獨，是一隻黑白孔雀。',
]
export const getRandomPlaceholder = () => sample(placeholderCopywrites)

export const MAX_COMMENT_TEXT_LENGTH = 500
