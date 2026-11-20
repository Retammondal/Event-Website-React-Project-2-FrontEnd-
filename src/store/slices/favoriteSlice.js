import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
    name : "favorite_Slice",                     // Name of that slice
    initialState : {
        items : JSON.parse(localStorage.getItem("eventsphere-favorites")) || []
    },                      // initial data
    reducers : {
        toggleFavorites(state, action) {
            // state.name = action.payload
            const event = action.payload;                                           // --> Whole events we are passing through
            const isEventExist = state.items.find(                                  // if got give that; otherwise give undefined
                (e)=> (e.id || e._id) === (event.id || event._id)                   // extra risk checking id or, _id
            );
            if (isEventExist){
                state.items = state.items.filter((e) => (e.id || e._id) !== (event.id || event._id) )
            } else{
                state.items.push(event)
            }

            localStorage.setItem("eventsphere-favorites", JSON.stringify(state.items))
        },
        removeFavorites(state) {

        },
        clearFavorites(state) {
            state.items = []
            localStorage.clear("eventsphere-favorites")
        }
    }
})

export default favoriteSlice.reducer;
export const {toggleFavorites, removeFavorites, clearFavorites} = favoriteSlice.actions;

// Reducers : Collection of Reducer Functions
// Reducer : Function that updates the state of slice
// e.g.  toggleFavorites(state) {} --> this is reducer function and state params take the initial State
// Note : favoriteSlice.actions --> gives object containing all the reducer functions