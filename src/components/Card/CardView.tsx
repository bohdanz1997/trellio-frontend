import React from 'react'
import styled from 'styled-components'
import { useEvent, useStore } from 'effector-react'
import {
  $currentId,
  $hoveredId,
  $isEditing,
  cardClicked,
  cardHovered,
  cardLeft,
} from 'models/card'
import { Card, removeCardFx } from 'models/cards'

import { DeleteButton } from '../Button'
import { EditableTitle } from './EditableTitle'

type Props = {
  card: Card
}

export const CardView: React.FC<Props> = ({ children, card }) => {
  const hoveredId = useStore($hoveredId)
  const isEditing = useStore($isEditing)
  const currentId = useStore($currentId)
  const events = useEvent({
    cardHovered,
    cardLeft,
    cardClicked,
    removeCardFx,
  })

  const showActions = hoveredId === card.id
  const showEditableField = isEditing && currentId === card.id

  return (
    <Container
      onMouseEnter={() => events.cardHovered(card.id)}
      onMouseLeave={() => events.cardLeft(card.id)}
    >
      <Title>
        {showEditableField ? (
          <EditableTitle />
        ) : (
          <TitleText onClick={() => events.cardClicked(card.id)}>
            {card.title}
          </TitleText>
        )}
      </Title>
      {showActions && (
        <Actions>
          <DeleteButton onClick={() => events.removeCardFx(card.id)}>
            Delete
          </DeleteButton>
        </Actions>
      )}
      <Content>{children}</Content>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  border-radius: var(--border-radius);
  width: 100%;
  background-color: white;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  margin-bottom: var(--p2);
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`

const Actions = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  padding: var(--p2);
`

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--p2);
  font-size: var(--font-size4);
  max-width: 75%;
`

const TitleText = styled.div`
  width: 100%;
`

const Content = styled.div`
  padding: var(--p2);
  font-size: var(--font-size3);
`
