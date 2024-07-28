import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'


export const verifyPAN = createAsyncThunk("customers/verifyPAN", async(panNumber) =>{
    const response = await axios.post("https://lab.pixel6.co/api/verify-pan.php" , {panNumber})
    return response.data;
})

export const fetchPostcodeDetails = createAsyncThunk("customers/fetchPostcodeDetails" , async(postcode) =>{
    const response = await axios.post("https://lab.pixel6.co/api/get-postcode-details.php" , {postcode})
    return response.data
})

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        list: [],
        panVerification: null,
        postcodeDetails : null,
    },
    reducers: {
        addCustomer : (state, action) =>{
            state.list.push(action.payload);
        },
        editCustomer : (state, action) =>{
            const index = state.list.findIndex(customer => customer.id === action.payload.id);
            state.list[index] = action.payload;
        },
        deleteCustomer : (state, action) =>{
            state.list = state.list.filter(customer => customer.id !== action.payload.id); 
        },
    },
    extraReducers : (builder) =>{
        builder
            .addCase(verifyPAN.fulfilled, (state, action) =>{
                state.panVerification = action.payload;
            })
            .addCase(fetchPostcodeDetails. fulfilled, (state, action) =>{
                state.postcodeDetails = action.payload;
            });
    },
})

export const {addCustomer, editCustomer, deleteCustomer} = customerSlice.actions;
export default customerSlice.reducer;