import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

// Define a type for the slice state
interface EssentialState {
    value: number;
}

// Define the initial state using that type
const initialState: EssentialState = {
    value: 0,
};

export const essentialSlice = createSlice({
    name: "essential",
    initialState,
    reducers: {},
});

export const {} = essentialSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value;

export default essentialSlice.reducer;
