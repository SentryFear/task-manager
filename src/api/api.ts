import axios from "axios"
import {TaskType} from "../redux/task-reducer";

axios.defaults.baseURL = 'https://5efa30f2bc5f8f0016c67784.mockapi.io/';

export const tasksAPI = {
    getTasks() {
        return axios.get<Array<TaskType>>(`tasks`).then(res => res.data)
    },
    putTask(data:TaskType) {
        return axios.put<TaskType>(`tasks/`+data.id, data).then(res => res.data)
    },
    postTask(data:TaskType) {
        return axios.post<TaskType>(`tasks`, data).then(res => res.data)
    }
}