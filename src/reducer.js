import { useEffect, useReducer, useState } from "react";
import { get } from "./apiService";

const StatusReducer = () => {
    const [unread, setUnread] = useState([])
    useEffect(() => {
        get("message?status=0").then((response) => {
            setUnread(response.data)
        })
    })
    const reducer = (state, action) => {
        if (action.type==="") {}
    }

    const [state, dispatch] = useReducer(reducer, 0)
}