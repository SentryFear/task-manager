import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useSelector, useDispatch} from "react-redux"
import {AppStateType} from "./redux/store"
import {actions, addTask, editTask, requestTasks, TaskType} from "./redux/task-reducer"
import {NavLink, useParams} from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

type ActiveProps = {
    active?: boolean
}

type TaskProps = {
    active?: boolean
    yellow?: boolean
    red?: boolean
}

const Container = styled.div<ActiveProps>`
    display: grid;
    grid-template-areas: 
    "header header"
    "main sidebar";
    grid-template-columns: ${(props) => props.active ? "2fr 1fr" : "2fr"};
    align-items: start;
`

const Header = styled.div`
    display: grid;
    grid-area: header;
    background-color: #2f3243;
    font-size: 20px;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-left: 20px;
    border-bottom: solid 2px #1c2230;
`
const Main = styled.div`
    display: grid;
    grid-area: main;
`

const Sidebar = styled.div<ActiveProps>`
    display: ${(props) => props.active ? "grid" : "none"};
    grid-area: sidebar;
    background-color: #2f3243;
    border: solid 2px #1c2230;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
`
const SidebarName = styled.div`
    background-color: #2f3243;
    font-size: 20px;
    float: left;
    margin-top: 3px;
    & input {
      font-size: 20px;
      margin-top: 3px;
    }
`
const SidebarDesc = styled.div`
    margin-top: 30px;
    & input {
      font-size: 20px;
      margin-top: 3px;
    }
    & select {
      font-size: 20px;
      margin-top: 3px;
    }
`
const SidebarHeader = styled.div`
    height: 24px;
`

const Ul = styled.ul`
    margin: 17px 7px 7px 7px;
    padding: 4px;
    float: left;
    & a {
        color: #c4c6cf;
        text-decoration: none;
    }
`
const Li = styled.li<ActiveProps>`
        background-color: ${(props) => props.active ? "#7976db" : "#5049e0"};
        color: ${(props) => props.active ? "#000000" : "#c4c6cf"};
        display: inline;
        margin-right: 3px;
        padding: 7px 15px;
        border: solid 1px #24255f;
        border-radius: 5px;
        font-size: 12px;
    `
interface RouteParams {
    id: string
}

const Tasks = styled.div`
    
`
const Task = styled.div<TaskProps>`
        display: grid;
        grid-template-areas: 
        "name date conf";
        ${(props) => props.active 
            ?
                props.red ? "background-color: #7b2626;" : props.yellow ? "background-color: #307976;" : "background-color: #3b4055;" 
            :
                props.red ? "background-color: #7d0808;" : props.yellow ? "background-color: #066b66;" : "background-color: #2f3243;"
        };
        
    //props.active ? "#3b4055" : "#2f3243"};
    //props.yellow ? "red" : "green"};
    //props.active ? "#3b4055" : "#2f3243" || 
        grid-template-columns: 5fr 5fr 1fr;
        align-items: start;
        margin: 10px;
        border: solid 2px #1c2230;
        border-radius: 10px;
        padding: 20px;
        &.confirmed {
            text-decoration: line-through;
            color: #4d5169;
            background-color: ${(props) => props.active ? "#344055" : "#242c3a"};
        }
        &.dropArea {
           color: black !important;
           background: white !important;
           position: relative;
           height: 35px;
        
           &::before {
            content: "Drop Here";
            font-size: 0.5em;
            text-transform: uppercase;
            width: 100%;
            height: 100%;
            border: 2px dashed black;
            border-radius: 3px;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
           }
        
           div {
            display: none;
           }
        }
    `
const TaskName = styled.div`
    display: grid;
    grid-area: name;
`
const TaskDate = styled.div`
    display: grid;
    grid-area: date;
`

const Label = styled.div`
    font-size: 12px;
    color: #8a91a2;
`

const AddButton = styled.a`
    float: right;
    background-color: #5049e0;
    color: #c4c6cf;
    display: inline;
    margin: 17px 12px 7px 7px;
    padding: 7px 15px;
    border: solid 1px #24255f;
    border-radius: 5px;
    font-size: 12px;
    text-decoration: none;
    cursor: pointer;
`
const EditButton = styled.a`
    float: right;
    background-color: #5049e0;
    color: #c4c6cf;
    display: inline;
    padding: 7px 15px;
    border: solid 1px #24255f;
    border-radius: 5px;
    font-size: 12px;
    text-decoration: none;
`
const SaveButton = styled.button`
    float: right;
    background-color: #5049e0;
    color: #c4c6cf;
    display: inline;
    padding: 7px 15px;
    border: solid 1px #24255f;
    border-radius: 5px;
    font-size: 12px;
    text-decoration: none;
`

const ConfirmButton = styled.button`
    float: right;
    background-color: #5049e0;
    color: #c4c6cf;
    display: inline;
    padding: 7px 15px;
    border: solid 1px #24255f;
    border-radius: 5px;
    font-size: 12px;
    text-decoration: none;
    display: grid;
    grid-area: conf;
`

const EmptyP = styled.p`
    padding: 20px;
`

const App: React.FC = () => {

    const tasks = useSelector((state: AppStateType) => state.tasks)
    const dispatch = useDispatch()

    const params = useParams<RouteParams>()

    const [tab, setTab] = useState(1)

    const [task, setTask] = useState(0)

    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        dispatch(requestTasks())
        if(Number(params.id) > 1) setTab(Number(params.id))
    }, [])

    //const [dragStartTask, setDragStartTask] = useState()
    //const [dragOverTask, setDragOverTask] = useState()

    const initialDnDState = {
        draggedFrom: {} as TaskType,
        draggedTo: {} as TaskType,
        isDragging: false as boolean
    }

    const [dragAndDrop, setDragAndDrop] = useState(initialDnDState)

    const [form, setForm] = useState({} as TaskType)

    const onDragStart = (event:any, item:TaskType) => {

        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: item,
            isDragging: true,
        });

        // Note: this is only for Firefox.
        event.dataTransfer.setData("text/html", '');
    }

    const onDragOver = (event:any, item:TaskType) => {

        event.preventDefault();


        // index of the item being dragged
        const draggedFrom = dragAndDrop.draggedFrom;

        if(draggedFrom !== null) {

            const draggedTo = item

            if (draggedTo !== dragAndDrop.draggedTo){
                setDragAndDrop({
                    ...dragAndDrop,
                    draggedTo: draggedTo
                })
            }
        }
    }

    const onDrop = () => {

        dispatch(editTask({...dragAndDrop.draggedFrom, order: dragAndDrop.draggedTo.order}))

        dispatch(editTask({...dragAndDrop.draggedTo, order: dragAndDrop.draggedFrom.order}))
        //dispatch(actions.setTasks(dragAndDrop.updatedOrder))

        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: {} as TaskType,
            draggedTo: {} as TaskType,
            isDragging: false
        });
    }

    const onDragLeave = () => {
        setDragAndDrop({
            ...dragAndDrop,
            draggedTo: {} as TaskType
        });
    }

    const handleEdit = (e:React.FormEvent) => {
        e.preventDefault()
        setEditMode(false)
        dispatch(editTask(form))
    }

    const handleAdd = async (e:React.FormEvent) => {

        e.preventDefault()

        setEditMode(false)

        await dispatch(addTask(form))

        await dispatch(requestTasks())
    }

    const confirmTask = (item:TaskType) => {
        dispatch(editTask({...item, confirmed: true}))
    }

    const changeForm = (e:any) => {
        let {value, name} = e.target
        setForm({...form, [name]:value})
    }

    const changeDate = (date:any) => {
        setForm({...form, deadline:date})
    }

    return (
        <Container active={!!task || editMode}>
            <Header>Tasks</Header>
            <Main>
                <div>
                    <Ul>
                        <NavLink to="/tab/1"><Li active={tab === 1} onClick={() => setTab(1)}>Tab 1</Li></NavLink>
                        <NavLink to="/tab/2"><Li active={tab === 2} onClick={() => setTab(2)}>Tab 2</Li></NavLink>
                        <NavLink to="/tab/3"><Li active={tab === 3} onClick={() => setTab(3)}>Tab 3</Li></NavLink>
                    </Ul>
                    <AddButton onClick={() => {
                        setEditMode(true)
                        setForm({name: '', description: '', deadline: '', tab:1} as TaskType)
                        setTask(0)
                    }}>Add Task</AddButton>
                </div>
                <Tasks>
                    {tasks.tasks.length > 0 ? (
                        tasks.tasks
                            .sort((a, b) => a.order > b.order ? 1 : -1)
                            .map((item) => (
                            Number(item.tab) === tab ?
                                <Task key={item.id}
                                      active={task === item.id}
                                      yellow={new Date(item.deadline) <= new Date(new Date().getTime() + 3*24*60*60*1000)}
                                      red={new Date(item.deadline) <= new Date()}
                                      onClick={() => {
                                          setTask(item.id)
                                          setEditMode(false)
                                      }}
                                      draggable="true"
                                      onDragStart={(e) => onDragStart(e, item)}
                                      onDragOver={(e) => onDragOver(e, item)}
                                      onDrop={onDrop}
                                      className={dragAndDrop && dragAndDrop.draggedTo.id === item.id ? "dropArea" : "" || item.confirmed ? "confirmed" : ""}
                                      onDragLeave={onDragLeave}
                                >
                                    <TaskName>
                                        <Label>Name</Label>
                                        <div>{item.name}</div>
                                    </TaskName>
                                    <TaskDate>
                                        <Label>Date</Label>
                                        <div>
                                            {new Intl.DateTimeFormat("ru-RU", {
                                                year: "numeric",
                                                month: "long",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit"
                                            }).format(item.deadline ? new Date(item.deadline) : new Date())}
                                        </div>
                                    </TaskDate>
                                    {item.confirmed ? "" : <ConfirmButton onClick={() => confirmTask(item)}>Confirm</ConfirmButton>}
                                </Task>
                                : ''
                        ))
                    ) : (
                        <EmptyP>No Tasks added</EmptyP>
                    )}
                </Tasks>
            </Main>

                {(!!task) ? tasks.tasks.filter(item => item.id === task).map(item => (
                    <Sidebar key={item.id} active={!!task || editMode}>
                        <form onSubmit={handleEdit}>
                            <SidebarHeader>
                                <SidebarName>{editMode ? <input name='name' value={form.name} onChange={changeForm} /> : item.name}</SidebarName>
                                <EditButton onClick={() => {
                                    setEditMode(true)
                                    setForm(item)
                                }}>Edit Task</EditButton>
                            </SidebarHeader>
                            <SidebarDesc>
                                <Label>Description</Label>
                                <div>{editMode ? <input name='description' value={form.description} onChange={changeForm} /> : item.description}</div>
                            </SidebarDesc>
                            <SidebarDesc>
                                <Label>Date</Label>
                                <div>{editMode
                                    ? <DatePicker
                                        selected={form.deadline ? new Date(form.deadline) : new Date()}
                                        onChange={date => changeDate(date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="d MMMM yyyy, HH:mm:ss"
                                    />
                                    : new Intl.DateTimeFormat("ru-RU", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                }).format(item.deadline ? new Date(item.deadline) : new Date())}</div>
                            </SidebarDesc>
                            <SidebarDesc>
                                <Label>Category</Label>
                                <div>{editMode
                                    ? <select name='tab' onChange={changeForm} defaultValue={form.tab}>
                                        <option value={1}>Tab 1</option>
                                        <option value={2}>Tab 2</option>
                                        <option value={3}>Tab 3</option>
                                </select> : item.tab}</div>
                            </SidebarDesc>
                            {item.confirmed ? <SidebarDesc><Label>Confirmed</Label></SidebarDesc> : ''}
                            {editMode ? <SaveButton type="submit">Save Task</SaveButton>: '' }
                        </form>
                    </Sidebar>
                ))
                : <Sidebar key="AddNewTask" active={!!task || editMode}>
                        <form onSubmit={handleAdd}>
                            <SidebarHeader>
                                <SidebarName><input name='name' value={form.name || ''} placeholder="Name" onChange={changeForm} /></SidebarName>
                            </SidebarHeader>
                            <SidebarDesc>
                                <Label>Description</Label>
                                <div><input name='description' value={form.description || ''} placeholder="Description" onChange={changeForm} /></div>
                            </SidebarDesc>
                            <SidebarDesc>
                                <Label>Date</Label>
                                <div>
                                    <DatePicker selected={form.deadline ? new Date(form.deadline) : new Date()}
                                                onChange={date => changeDate(date)}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="time"
                                                dateFormat="d MMMM yyyy, HH:mm:ss"
                                    />
                                </div>
                            </SidebarDesc>
                            <SidebarDesc>
                                <Label>Category</Label>
                                <div>
                                    <select name='tab' onChange={changeForm} defaultValue={form.tab || 1}>
                                        <option value={1}>Tab 1</option>
                                        <option value={2}>Tab 2</option>
                                        <option value={3}>Tab 3</option>
                                    </select>
                                </div>
                            </SidebarDesc>
                            <SaveButton type="submit">Save Task</SaveButton>
                        </form>
                    </Sidebar>
                }
        </Container>
    );
}

export default App;
