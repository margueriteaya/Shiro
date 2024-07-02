import { sample } from '~/lib/lodash'

const placeholderCopywrites = [
  '可讲可不讲。',
  '或许此地可以留下足迹',
  '说点什么吧，我会好好听的。',
  '附近的星球来自于回声，沼泽来自于地面的失眠。',
  '没有了剃刀就封锁语言，没有了心脏却活了九年。',
  '心里的蜘蛛模仿人类张灯结彩，携带乐器的游民也无法传达。',
  '我所了解的孤独，是一只黑白孔雀。',
]
export const getRandomPlaceholder = () => sample(placeholderCopywrites)

export const MAX_COMMENT_TEXT_LENGTH = 500
