import React, { useReducer, useState, useCallback } from 'react'

import ErrorModal from '../UI/ErrorModal'
import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id)
    default:
      throw new Error('Something went wrong!')
  }
}

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  // const [ingredients, setIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true)
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
        setIsLoading(false)
        // setIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: data.name, ...ingredient },
        // ])
        dispatch({ type: 'ADD', ingredient: { id: data.name, ...ingredient } })
      })
  }

  const onRemoveIngredientHandler = (id) => {
    setIsLoading(true)
    fetch(
      `https://react-hooks-tutorial-hehe-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((res) => {
        setIsLoading(false)
        // setIngredients((prevIngredients) => {
        //   return prevIngredients.filter((ig) => id !== ig.id)
        // })
        dispatch({ type: 'DELETE', id: id })
      })
      .catch((err) => {
        setIsLoading(false)
        setError(err.message)
        // setState is batched here as they both belong to the same synchronous event handler, causing only one rerender cycle
      })
  }

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, [dispatch /* dispatch is a dependency, but will never change */])
  // useCallback caches filterIngredientsHandler so it change after rerender cycles.
  // This is important because otherwise, useEffect in Search.js would be in an infinite loop

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

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
