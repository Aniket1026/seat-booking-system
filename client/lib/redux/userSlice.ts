import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/User.type";
const URL = process.env.NEXT_PUBLIC_API_URL!;

interface UserState {
  user: User | null;
  status: "loading" | "success" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "loading",
  error: null,
};

export const signUpHandler = createAsyncThunk(
  "user/signUp",
  async (user: User) => {
    try {
      const response = await fetch(`${URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          status: response.status,
          message: errorData?.message || "Signup failed",
        };
      }

      const data = await response.json();
      return {
        status: response.status,
        user: data,
      };
    } catch (error: any) {
      throw new Error("Error in signing up: " + error.message);
    }
  }
);

export const loginHandler = createAsyncThunk(
  "user/login",
  async (user: User) => {
    try {
      const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          status: response.status,
          message: errorData?.message || "Login failed",
        };
      }

      const data = await response.json();

      return {
        status: response.status,
        user: data,
      };
    } catch (error: any) {
      throw new Error("Error in logging in: " + error.message);
    }
  }
);

export const logoutHandler = createAsyncThunk("user/logout", async () => {
  try {
    const response = await fetch(`${URL}/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return response.json();
  } catch (error: any) {
    throw new Error("Error in logging out: " + error.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpHandler.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(signUpHandler.fulfilled, (state, action) => {
      state.status = "success";
      state.user = action.payload.user;
    });
    builder.addCase(signUpHandler.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });

    builder.addCase(loginHandler.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loginHandler.fulfilled, (state, action) => {
      state.status = "success";
      state.user = action.payload.user;
    });
    builder.addCase(loginHandler.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
    builder.addCase(logoutHandler.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(logoutHandler.fulfilled, (state) => {
      state.status = "success";
      state.user = null;
    });
  },
});

export default userSlice.reducer;
