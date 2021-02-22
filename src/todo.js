import {useEffect, useState} from 'react'
import axios from 'axios'


function Todo() {
    const [todo, setTodo] = useState("")
    const [todos, setTodos] = useState([])
    const [edit, setEdit] = useState(false)
    const [id, setID] = useState('')

    const changeValue = e => {
        setTodo(e.target.value)
    }

    useEffect(() => {
       loadTodos()
    }, [])

    const loadTodos = () => {
        axios.get('/api/gettodos')
        .then((response) => {
            setTodos(response.data)
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const todoSubmit = e => {
        e.preventDefault()
        if(!todo) {
            return 
        }
        if(edit) {
            axios.put(`/api/update/${id}`, {todo: todo})
            .then((res) => {
                loadTodos()
            })
            .catch((err) => {
                alert(err.msg)
            })
            setEdit(false)
               setTodo("")
        } else {
            axios.post('/api/add', {
                todo: todo
               })
               .then(function (response) {
                 setTodos([...todos, response.data])
                 
               })
               .catch(function (error) {
                 console.log(error);
               });
        }
    }

    const deleteTodo = async (id) => {
        try {
            const deleteT = axios.delete(`/api/delete/${id}`)
            await deleteT   
            loadTodos()
        } catch (error) {
            console.log(error)
        }
        setTodo("")
    }

    const editTodo = async (id, name) => {
        setID(id)
        setTodo(name)
        setEdit(true)
    }
    
    return(
        <div>
            <h2>Todo page</h2>  
            <form onSubmit={todoSubmit}>
                <input type="text" value={todo} onChange={changeValue} placeholder="enter todo" />
                <button type="submit" onClick={todoSubmit}>{edit ? "update": "Add todo"}</button>
            </form>
            <div>
               {
                   todos.map((item) => (
                       <div key={item._id}>
                            {item.todo}
                            <button onClick={() => editTodo(item._id, item.todo)}>Edit</button>
                            <button onClick={() => deleteTodo(item._id)}>Delete</button>
                       </div>
                   ))
               }
            </div>
        </div>
    )
}
export default Todo