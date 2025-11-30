import TextContent from './TextContent'
import VideoContent from './VideoContent'
import RedirectContent from './RedirectContent'
import CodeContent from './CodeContent'
import WordleContent from './WordleContent'
import SudokuContent from './SudokuContent'
import RecipeContent from './RecipeContent'
import SpotDiffContent from './SpotDiffContent'
import GiftWrapContent from './GiftWrapContent'
import RhymeContent from './RhymeContent'
import QuizContent from './QuizContent'

const componentMap = {
  text: TextContent,
  video: VideoContent,
  redirect: RedirectContent,
  code: CodeContent,
  wordle: WordleContent,
  sudoku: SudokuContent,
  recipe: RecipeContent,
  'spot-diff': SpotDiffContent,
  'gift-wrap': GiftWrapContent,
  rhyme: RhymeContent,
  quiz: QuizContent,
}

export function getContentComponent(type) {
  return componentMap[type] || TextContent
}
