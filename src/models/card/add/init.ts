import { combine, guard, sample } from 'effector'
import { boardClicked } from 'models/board'
import * as listModel from 'models/list'
import { addCard, createCardFx } from 'models/cards'
import { $title, enterPressed } from 'models/card/current'

import { $isAdding, addButtonClicked } from './index'

$isAdding.on(addButtonClicked, () => true).reset(boardClicked, addCard)

const $createCardData = combine(
  $title,
  listModel.$currentId,
  (title, listId) => ({
    title,
    listId: listId || 0,
  }),
)

const submitClicked = guard({
  source: guard({
    source: enterPressed,
    filter: $isAdding.map(Boolean),
  }),
  filter: listModel.$currentId.map(Boolean),
})

sample({
  source: $createCardData,
  clock: submitClicked,
  target: createCardFx,
})
