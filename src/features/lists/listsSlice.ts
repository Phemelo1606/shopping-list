import { createSlice } from "@reduxjs/toolkit";

export interface ShoppingItem {
  id: number;
  userId: number;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  imageUrl?: string;
  bought: boolean;
  createdAt: string;
}

interface ListsState {
  items: ShoppingItem[];
  status: "idle" | "loading" | "failed";
}

const initialState: ListsState = { items: [], status: "idle" };

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {},
});

export default listsSlice.reducer;