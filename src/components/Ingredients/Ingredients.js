import React, { useReducer, useCallback, useMemo } from 'react'
// useCallback memorizes functions; useMemo memoizes values

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
// reducers are useful for complex state that may change frequently or changes based on its previous state

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...httpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errMsg }
    case 'CLEAR':
      return { ...httpState, error: null }
    default:
      throw new Error('Something went wrong!')
  }
}
// reducers are also useful for states that are connected to each other

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  })
  // const [ingredients, setIngredients] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState(false)
  // setState is batched when two more more setState are used in the same cycle as they both belong to the same synchronous event handler, causing only one rerender cycle

  const addIngredientHandler = useCallback(
    (ingredient) => {
      dispatchHttp({ type: 'SEND' })
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
          dispatchHttp({ type: 'RESPONSE' })
          // setIngredients((prevIngredients) => [
          //   ...prevIngredients,
          //   { id: data.name, ...ingredient },
          // ])
          dispatch({
            type: 'ADD',
            ingredient: { id: data.name, ...ingredient },
          })
        })
    },
    [dispatchHttp]
  )
  // added useCallback so <IngredientForm won't rerender when not necessary (despite using React.memo)

  const onRemoveIngredientHandler = useCallback(
    (id) => {
      dispatchHttp({ type: 'SEND' })
      fetch(
        `https://react-hooks-tutorial-hehe-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        {
          method: 'DELETE',
        }
      )
        .then((res) => {
          dispatchHttp({ type: 'RESPONSE' })
          // setIngredients((prevIngredients) => {
          //   return prevIngredients.filter((ig) => id !== ig.id)
          // })
          dispatch({ type: 'DELETE', id: id })
        })
        .catch((err) => {
          dispatchHttp({ type: 'ERROR', errMsg: err.message })
        })
    },
    [dispatchHttp]
  )

  const filterIngredientsHandler = useCallback(
    (filteredIngredients) => {
      dispatch({ type: 'SET', ingredients: filteredIngredients })
    },
    [dispatch /* dispatch is a dependency, but will never change */]
  )
  // useCallback caches filterIngredientsHandler so it change after rerender cycles.
  // This is important because otherwise, useEffect in Search.js would be in an infinite loop

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' })
  }, [])

  const ingredientList = useMemo(() => (
    <IngredientList
      ingredients={ingredients}
      onRemoveItem={onRemoveIngredientHandler}
    />
  ), [ingredients, onRemoveIngredientHandler])

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  )
}

export default Ingredients
