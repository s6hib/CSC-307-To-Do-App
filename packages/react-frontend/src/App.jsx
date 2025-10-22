import { useState } from "react"; // a react hook that lets our components store data
import "./App.css";

// defining a react component
function App() {
  // todos is an array that stores all tasks, setTodos is the function that updates this state
  const [todos, setTodos] = useState([]);
  
  // inputValue is an array that stores what the user types in the text box, setInputValue is the function that updates this state
  const [inputValue, setInputValue] = useState("");

  // function to add a new todo
  const addTodo = () => {
    // check if the input is empty (trim removes spaces)
    if (inputValue.trim() === "") return;
    
    // Create a new todo object with unique id, text, and completed status
    const newTodo = {
      id: Date.now(), // Simple way to generate unique ID
      text: inputValue,
      completed: false
    };
    
    // Add the new todo to the EXISTING list
    setTodos([...todos, newTodo]);
    
    // Clear the input field
    setInputValue("");
  };

  // Function to toggle todo completion status
  const toggleComplete = (id) => {
    // loops through all todos using map
    setTodos(todos.map(todo => 
      // once matched, create a new todo object everything the same, but change completion status
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    // use filter to keep only todos whose id doesn't match the one to delete
    setTodos(todos.filter(todo => todo.id !== id));
  };



  // ===================EVERYTHING SHOWN ON SCREEN=============
  return (
    <div className="App">
      {/* title */}
      <h1>My Todo List</h1>
      
      {/* Input section to add new todos */}
      <div className="todo-input">
        <input 
          type="text"
          value={inputValue}
          // updates input value whenever the user types
          onChange={(e) => setInputValue(e.target.value)}
          // user can press Enter to add a todo
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Enter a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Display the list of todos */}
      <ul className="todo-list">
        {/* loop thru all todos using map, and display each inside a <li> */}
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            {/* Checkbox to mark todo as complete */}
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            
            {/* Todo text */}
            <span>{todo.text}</span>
            
            {/* Delete button */}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      {/* Show message if no todos */}
      {todos.length === 0 && <p>No todos yet. Add one to get started!</p>}
    </div>
  );
}

export default App;
