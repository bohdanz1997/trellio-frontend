import './current/init'
import { combine, forward, guard, sample } from 'effector'
import { uuid } from 'lib/uuid'
import { boardClicked } from '../board'
import { addCard, removeCardById, updateCard } from '../cards'
import * as listModel from '../list'
import { app } from '../app'
import { setCurrentId, $currentCard, resetCurrentId } from './current'
import {
  $hoveredId,
  $isAdding,
  $isEditing,
  $title,
  addButtonClicked,
  cardClicked,
  cardHovered,
  cardLeaved,
  enterPressed,
  titleChanged,
} from './index'

$isAdding.on(addButtonClicked, () => true).reset(boardClicked, addCard)
$isEditing.on(cardClicked, () => true).reset(boardClicked, updateCard)

forward({
  from: cardClicked,
  to: setCurrentId,
})

forward({
  from: [addCard, updateCard, removeCardById, boardClicked],
  to: resetCurrentId,
})

$title
  .on(titleChanged, (_, title) => title)
  .reset(addCard, updateCard, removeCardById, boardClicked)

$hoveredId.on(cardHovered, (_, id) => id).reset(cardLeaved)

sample({
  source: $currentCard,
  clock: cardClicked,
  fn: (card) => card?.title || '',
  target: $title,
})

const addNewCard = app.createEvent<{
  id: number
  title: string
  listId: number | null
}>()

const $createCardData = combine(
  $title,
  listModel.$currentId,
  (title, listId) => ({
    id: uuid(),
    title,
    listId,
  }),
)

sample({
  source: $createCardData,
  clock: guard({
    source: enterPressed,
    filter: $isAdding.map(Boolean),
  }),
  target: addNewCard,
})

guard({
  source: addNewCard,
  filter: listModel.$currentId.map(Boolean),
  target: addCard,
})

const $updateData = combine($currentCard, $title, (card, title) => ({
  ...card,
  title,
}))

sample({
  source: $updateData,
  clock: guard({
    source: enterPressed,
    filter: $isEditing.map(Boolean),
  }),
  target: updateCard,
})

// $isAdding.watch((v) => console.log('card adding', v))
// $isEditing.watch((v) => console.log('card editing', v))
