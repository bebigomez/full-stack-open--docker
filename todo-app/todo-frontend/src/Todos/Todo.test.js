import { screen, render, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom'
import Todo from "../Todos/Todo"

test("renders todo correctly", () => {
  const todoMock = {
    text: "Test Todo",
    done: false,
  }
  const deleteTodo = jest.fn()
  const completeTodo = jest.fn()

  render(<Todo todo={todoMock} deleteTodo={deleteTodo} completeTodo={completeTodo} />)

  expect(screen.getByText("Test Todo")).toBeInTheDocument()
  expect(screen.getByText("This todo is not done")).toBeInTheDocument()

  fireEvent.click(screen.getByText("Set as done"))
  expect(completeTodo).toHaveBeenCalledTimes(1)

  fireEvent.click(screen.getByText("Delete"))
  expect(deleteTodo).toHaveBeenCalledTimes(1)
})