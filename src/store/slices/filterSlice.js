import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filters_Slice",
    initialState : {
        format: '',
        search: '',                 // filters came from Search Query
        isPaid: '',
        category: ''
    },
    reducers : {
        setFormat (state, action){
            state.format = action.payload
        },
        setEntry(state, action){
            state.isPaid = action.payload 
        }
    }
})
export default filterSlice.reducer
export const { setFormat,setEntry } = filterSlice.actions