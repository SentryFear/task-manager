import {BaseThunkType, InferActionsTypes} from "./store";
import {tasksAPI} from "../api/api";
import {Dispatch} from "redux";

export type TaskType = {
    id: number
    createdAt: string
    name: string
    description: string
    confirmAt: string
    deadline: string
    tab: number
    order: number
}

let initialState = {
    tasks: [] as Array<TaskType>
};

const taskReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "TM/TASK/SET_TASKS":
            return {
                ...state,
                ...action.payload
            }
        //case "TM/TASK/EDIT_TASK":
        //case "TM/TASK/DELETE_TASK":
        //case "TM/TASK/COMPLETE_TASK":
        case "TM/TASK/ADD_TASK":
            return {
                ...state,
                tasks: {...state.tasks, ...action.payload}
            }
        case "TM/TASK/SET_TASK":
            return {
                ...state,
                tasks: state.tasks.map((u: TaskType) => {
                    if (u.id === action.payload.task.id) {
                        return {
                            ...u,
                            ...action.payload.task
                        }
                    } else return u;
                })
            }
        default:
            return state;
    }
}

export const actions = {
    setTasks: (tasks: Array<TaskType>) => ({
        type: 'TM/TASK/SET_TASKS', payload: {tasks}
    } as const),
    setTask: (task: TaskType) => ({
        type: 'TM/TASK/SET_TASK', payload: {task}
    } as const),
    addTask: (task: TaskType) => ({
        type: 'TM/TASK/ADD_TASK', payload: {task}
    } as const),
}

export const requestTasks = (): ThunkType => {
    return async (dispatch: Dispatch<ActionsType>) => {
        let data = await tasksAPI.getTasks()
        dispatch(actions.setTasks(data))
    }
}

export const editTask = (task:TaskType): ThunkType => {
    return async (dispatch: Dispatch<ActionsType>) => {
        let data = await tasksAPI.putTask(task)
        dispatch(actions.addTask(data))
    }
}

export const addTask = (task:TaskType): ThunkType => {
    return async (dispatch: Dispatch<ActionsType>) => {
        let data = await tasksAPI.postTask(task)
        dispatch(actions.setTask(data))
    }
}

export default taskReducer;

export type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actions>
type ThunkType = BaseThunkType<ActionsType>