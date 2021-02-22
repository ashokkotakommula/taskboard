import {useState, useEffect} from 'react'
import './App.css';

let idx = 1;
function Task() {
  const [task, setTask] = useState("")
  const [search, setSearch] = useState("")
  const [pastSearch, setPastSearch] = useState([])

  const [completed, setCompleted] = useState([])
  const [progress, setProgress] = useState([])
  
  const [stausValue, setStatusValue] = useState("")

  const [alltasks, setAllTasks] = useState([])

  const [taskslist, setTaskList] = useState(
    [
      {
        id: idx++,
        task: "Task 1"
      }
    ]
  )

  const changeTaskValue = e => {
    setTask(e.target.value)
  }

  const deleteTask = id => {
    const newTaskList = taskslist.filter((task) => task.id !== id)
    setTaskList(newTaskList)
    localStorage.removeItem('tasklist')
    localStorage.setItem('tasklist', JSON.stringify(newTaskList))
  }
  
  const deleteCompletedTask = id => {
    const newTaskList = completed.filter(task => task.id !== id)
    setCompleted(newTaskList)
    localStorage.removeItem('completedlist')
    localStorage.setItem('completedlist', JSON.stringify(newTaskList))
  }

  const deleteProgressTask = id => {
    const newTaskList = progress.filter(task => task.id !== id)
    setProgress(newTaskList)
    localStorage.removeItem('progress')
    localStorage.setItem('progress', JSON.stringify(newTaskList))
  }
  
  // useEffect(() => {
  //   const allTodos = JSON.parse(localStorage.getItem('tasklist'))
  //   setTaskList(allTodos)
  //   const allCompletedTodos = JSON.parse(localStorage.getItem('completedlist'))
  //   setCompleted(allCompletedTodos)
  //   const allProgress = JSON.parse(localStorage.getItem('progress'))
  //   setProgress(allProgress)
  // }, [])

  const submitTask = e => {
    e.preventDefault()
    if(!task) {
      return
    }
    if(task && stausValue==="") {
      return
    } else if(task && stausValue==="todo") {
      setTaskList([...taskslist, {id: idx++, task: task}])
      localStorage.setItem('tasklist', JSON.stringify(taskslist))
    } else if(task && stausValue === "completed") {
      setCompleted([...completed, {id: idx++, task: task}])
      localStorage.setItem('completedlist', JSON.stringify(completed))
    } else if(task && stausValue === "progress") {
      setProgress([...progress, {id: idx++, task: task}])
      localStorage.setItem('progress', JSON.stringify(progress))
    }
    setTask("")
  }

  const searchtodo = (e) =>{
    setSearch(e.target.value);
    setAllTasks([...taskslist, ...progress, ...completed])
    const searched = alltasks.filter(task => task.task.includes(e.target.value))
    setPastSearch(searched)
    if (!e.target.value) {
      setPastSearch();
      setAllTasks([])
    }
  }
  //already searched value caching in array so remove array if empty
  
  const changeStatusTodo = (e, t) =>{  
    if(e === "completed") {
      const newTask = {
        id: t.id,
        task: t.task
      }
      setCompleted([...completed, newTask])
      const removeTask = taskslist.filter(id => id.id !== t.id)
      setTaskList(removeTask)
    } else if(e === "progress") {
      const newTask = {
        id: t.id,
        task: t.task
      }
      setProgress([...progress, newTask])
      const removeTask = taskslist.filter(id => id.id !== t.id)
      setTaskList(removeTask)
    } else {
      return
    }
  }

  const changeStatusProgress = (e, t) => {
    if(e === "todo") {
      const newTask = {
        id: t.id,
        task: t.task
      }
      setTaskList([...taskslist, newTask])
      const removeTask = progress.filter(id => id.id !== t.id)
      setProgress(removeTask)
    } else if(e === "completed") {
      const newTask = {
        id: t.id,
        task: t.task
      }
      setCompleted([...completed, newTask])
      const removeTask = progress.filter(id => id.id !== t.id)
      setProgress(removeTask)
    } else {
      return
    }
  }

  const changeStatusCompleted = (e, t) => {
    if(e === "todo") {
      const newTask = {
        id: t.id,
        task: t.task
      }
      setTaskList([...taskslist, newTask])
      const removeTask = completed.filter(id => id.id !== t.id)
      setCompleted(removeTask)
    } else if(e === "progress") {
      const newTask = {
        id: t.id,
        task: t.task
      }
      setProgress([...progress, newTask])
      const removeTask = completed.filter(id => id.id !== t.id)
      setCompleted(removeTask)
    } else {
      return
    }
  }

  return (
    <div className="App">
      <div>
        <h1>Task Board</h1>
        <div className="filter">
          <div>
            <input type="text" onChange={searchtodo} value={search} placeholder="Filter issues" />
            {search && pastSearch.map
              ? pastSearch.map((task) => (
                <div key={idx++} className="search-card">
                  {task.task}
                </div>
                ))
              : ""}
          </div>
        </div>

        <div className="task-form">
          <div>
            <form onSubmit={submitTask}>
              <input type="text" value={task} onChange={changeTaskValue} placeholder="Task Name"/>
                <select onChange={(e) => {
                  e.preventDefault()
                  setStatusValue(e.target.value)}} id="select">
                  <option value="">Select Status</option>
                  <option value="todo">Todo</option>
                  <option value="progress">Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button type="submit" id="add-task" onClick={submitTask}>Add Task</button>
            </form>
          </div>
        </div>
        
        <div className="task-container">
          <div className="all-tasks">
            <h4>TO DO <span>{taskslist.length ? taskslist.length : 0}</span></h4>
              {
                taskslist.map((task) => (
                  <div key={idx++} className="task-card">
                    {task.task}
                    <select id="select-option" onChange={(e) => changeStatusTodo(e.target.value, task)}>
                    <option value="">Change Status</option>
                    <option value="completed">Completed</option>
                    <option value="progress">Progress</option>
                  </select>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                ))
              }
          </div>

          <div className="progress-tasks" >
            <h4>IN PROGRESS <span>{progress.length ? progress.length : 0}</span></h4>
            {
              progress.map((task) => (
                <div key={idx++} className="task-card">
                  {task.task}
                  <select id="select-option" onChange={(e) => changeStatusProgress(e.target.value, task)}>
                  <option value="">Change Status</option>
                  <option value="todo">Todo</option>
                  <option value="completed">Completed</option>
                </select>
                  <button onClick={() => deleteProgressTask(task.id)}>Delete</button>
                </div>
              ))
            }
          </div>

          <div className="completed-tasks">
            <h4>COMPLETED <span>{completed.length ? completed.length : 0}</span></h4>
            {
              completed.map((task) => (
                <div key={idx++} className="task-card">
                  {task.task}
                  <select id="select-option"  onChange={(e) => changeStatusCompleted(e.target.value, task)}> 
                  <option value="">Change Status</option>
                  <option value="todo">Todo</option>
                  <option value="progress">Progress</option>
                </select>
                  <button onClick={() => deleteCompletedTask(task.id)}>Delete</button>
                </div>
              ))
            }
          </div>
        </div>
        </div>
      </div>
  );
}

export default Task;
