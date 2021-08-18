import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {NavLink, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {addTask, editTask, requestTasks, TaskType} from "../../redux/task-reducer";
import DatePicker from "react-datepicker";
import {ActiveProps} from "../../types";
import Task from "../Task/Task";

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

export const Label = styled.div`
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

const EmptyP = styled.p`
  padding: 20px;
`

const Tasks: React.FC = () => {

    const tasks = useSelector((state: AppStateType) => state.tasks)
    const dispatch = useDispatch()

    const params = useParams<RouteParams>()

    const [tab, setTab] = useState(1)

    const [task, setTask] = useState(0)

    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        dispatch(requestTasks())
        if (Number(params.id) > 1) setTab(Number(params.id))
    }, [dispatch, params.id])

    const [form, setForm] = useState({} as TaskType)

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault()
        setEditMode(false)
        dispatch(editTask(form))
    }

    const handleAdd = async (e: React.FormEvent) => {

        e.preventDefault()

        setEditMode(false)

        await dispatch(addTask(form))

        await dispatch(requestTasks())
    }

    const changeForm = (e: any) => {
        let {value, name} = e.target
        setForm({...form, [name]: value})
    }

    const changeDate = (date: any) => {
        setForm({...form, deadline: date})
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
                        setForm({name: '', description: '', deadline: '', tab: 1} as TaskType)
                        setTask(0)
                    }}>Add Task</AddButton>
                </div>
                <div>
                    {tasks.tasks.length > 0 ? (
                        tasks.tasks
                            .filter(value => value.tab === tab)
                            .sort((a, b) => a.order > b.order ? 1 : -1)
                            .map((item) => (
                                <Task task={item} activeTask={task} setActiveTask={setTask} setEditMode={setEditMode}/>
                            ))
                    ) : (
                        <EmptyP>No Tasks added</EmptyP>
                    )}
                </div>
            </Main>

            {(!!task) ? tasks.tasks.filter(item => item.id === task).map(item => (
                    <Sidebar key={item.id} active={!!task || editMode}>
                        <form onSubmit={handleEdit}>
                            <SidebarHeader>
                                <SidebarName>{editMode ?
                                    <input name='name' value={form.name} onChange={changeForm}/> : item.name}</SidebarName>
                                <EditButton onClick={() => {
                                    setEditMode(true)
                                    setForm(item)
                                }}>Edit Task</EditButton>
                            </SidebarHeader>
                            <SidebarDesc>
                                <Label>Description</Label>
                                <div>{editMode ? <input name='description' value={form.description}
                                                        onChange={changeForm}/> : item.description}</div>
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
                            {editMode ? <SaveButton type="submit">Save Task</SaveButton> : ''}
                        </form>
                    </Sidebar>
                ))
                : <Sidebar key="AddNewTask" active={!!task || editMode}>
                    <form onSubmit={handleAdd}>
                        <SidebarHeader>
                            <SidebarName><input name='name' value={form.name || ''} placeholder="Name"
                                                onChange={changeForm}/></SidebarName>
                        </SidebarHeader>
                        <SidebarDesc>
                            <Label>Description</Label>
                            <div><input name='description' value={form.description || ''} placeholder="Description"
                                        onChange={changeForm}/></div>
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
export default Tasks