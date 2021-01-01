import React, { useState, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([])

  const addIngredientHandler = (ingredient) => {
    fetch(
      'https://react-hooks-tutorial-hehe-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: data.name, ...ingredient },
        ])
      })
  }

  const onRemoveIngredientHandler = (id) => {
    fetch(
      `https://react-hooks-tutorial-hehe-default-rtdb.firebaseio.com/ingredients${id}.json`,
      {
        method: 'DELETE',
      }.then((res) => {
        setIngredients((prevIngredients) => {
          return prevIngredients.filter((ig) => id !== ig.id)
        })
      })
    )
  }

  const filterIngredientsHandler = useCallback(
    (filteredIngredients) => {
      setIngredients(filteredIngredients)
    },
    [setIngredients /* never re-runs */]
  )
  // useCallback caches filterIngredientsHandler so it change after rerender cycles.
  // This is important because otherwise, useEffect in Search.js would be in an infinite loop

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={onRemoveIngredientHandler}
        />
      </section>
    </div>
  )
}

export default Ingredients
