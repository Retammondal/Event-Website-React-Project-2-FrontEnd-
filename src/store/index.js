import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "./slices/favoriteSlice";
import filterReducer from "./slices/filterSlice";

export const store = configureStore({
    reducer : {
        favorites : favoriteReducer,
        filters : filterReducer
    }
})           // Kind of store created and exported

// Now this store is in floated space...we need to tell the application that this is the Store from where you will take the data
// Wrap Provider in App.jsx
// Inside Provider we have to pass props store={store}

// useSelector : To read the data
// useDispatch : To update the data