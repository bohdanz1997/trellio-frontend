import * as React from 'react'
import { useEvent, useStore } from 'effector-react/ssr'
import {
  $isAdding,
  $title,
  addButtonClicked,
  titleInputChanged,
  titleInputKeyPressed,
} from 'models/list'

import { AddButton } from '../Button/AddButton'
import { Input } from '../Input'

export const AddList = () => {
  const events = useEvent({
    addButtonClicked,
    titleInputChanged,
    titleInputKeyPressed,
  })
  const isAdding = useStore($isAdding)
  const title = useStore($title)

  return (
    <>
      {isAdding ? (
        <Input
          autoFocus
          type="text"
          value={title}
          onChange={events.titleInputChanged}
          onKeyPress={events.titleInputKeyPressed}
        />
      ) : (
        <AddButton onClick={() => events.addButtonClicked()}>
          Add another list
        </AddButton>
      )}
    </>
  )
}
