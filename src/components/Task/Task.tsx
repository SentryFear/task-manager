import React, {useState} from 'react'
import styled from "styled-components";
import {editTask, TaskType} from "../../redux/task-reducer";
import {useDispatch} from "react-redux";
import {Label} from "../Tasks/Tasks";
import {TaskProps} from "../../types";

const TaskDiv = styled.div<TaskProps>`
        display: grid;
        grid-template-areas: 
        "name date conf";
        ${(props) => props.active
    ?
    props.red ? "background-color: #7b2626;" : props.yellow ? "background-color: #307976;" : "background-color: #3b4055;"
    :
    props.red ? "background-color: #7d0808;" : props.yellow ? "background-color: #066b66;" : "background-color: #2f3243;"
};
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

const ConfirmButton = styled.button`
    float: right;
    background-color: #5049e0;
    color: #c4c6cf;
    padding: 7px 15px;
    border: solid 1px #24255f;
    border-radius: 5px;
    font-size: 12px;
    text-decoration: none;
    display: grid;
    grid-area: conf;
`
const Task = ({task,activeTask, setActiveTask, setEditMode}:{task:TaskType, activeTask:number, setActiveTask:any, setEditMode:any}) => {

    const initialDnDState = {
        draggedFrom: {} as TaskType,
        draggedTo: {} as TaskType,
        isDragging: false as boolean
    }

    const [dragAndDrop, setDragAndDrop] = useState(initialDnDState)
    const dispatch = useDispatch()

    const onDragStart = (event:any, item:TaskType) => {

        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: item,
            isDragging: true,
        });

        event.dataTransfer.setData("text/html", '');
    }

    const onDragOver = (event:any, item:TaskType) => {

        event.preventDefault();

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

        const dragTo = dragAndDrop.draggedTo.order
        const dragForm = dragAndDrop.draggedFrom.order

        dispatch(editTask({...dragAndDrop.draggedFrom, order: dragTo}))

        dispatch(editTask({...dragAndDrop.draggedTo, order: dragForm}))

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

    const confirmTask = (item:TaskType) => {
        dispatch(editTask({...item, confirmed: true}))
    }

    return (
        <TaskDiv key={task.id}
              active={activeTask === task.id}
              yellow={new Date(task.deadline) <= new Date(new Date().getTime() + 3*24*60*60*1000)}
              red={new Date(task.deadline) <= new Date()}
              onClick={() => {
                  setActiveTask(task.id)
                  setEditMode(false)
              }}
              draggable="true"
              onDragStart={(e) => onDragStart(e, task)}
              onDragOver={(e) => onDragOver(e, task)}
              onDrop={onDrop}
              className={dragAndDrop && dragAndDrop.draggedTo.id === task.id ? "dropArea" : "" || task.confirmed ? "confirmed" : ""}
              onDragLeave={onDragLeave}
        >
            <TaskName>
                <Label>Name</Label>
                <div>{task.name}</div>
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
                    }).format(task.deadline ? new Date(task.deadline) : new Date())}
                </div>
            </TaskDate>
            {task.confirmed ? "" : <ConfirmButton onClick={() => confirmTask(task)}>Confirm</ConfirmButton>}
        </TaskDiv>
    )
}

export default Task