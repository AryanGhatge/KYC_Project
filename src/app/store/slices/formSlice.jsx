"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1, // Initialize at step 1
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    nextStep(state) {
      // if (state.step < 5) {
      if (state.step < 7) {
        state.step += 1;
      }
    },
    prevStep(state) {
      if (state.step > 1) {
        state.step -= 1;
      }
    },
  },
});

export const { setStep, nextStep, prevStep } = formSlice.actions;
export default formSlice.reducer;
