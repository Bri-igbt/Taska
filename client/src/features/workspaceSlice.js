import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../configs/api.js";

export const fetchWorkspaces = createAsyncThunk(
    "workspace/fetchWorkspaces",
    async ({ getToken }, { rejectWithValue }) => {
        try {
        const token = await getToken();

        const { data } = await api.get("/api/workspaces", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        return data.workspaces || [];
        } catch (error) {
        return rejectWithValue(
            error?.response?.data?.message || error.message
        );
        }
    }
);

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

/* =================== SLICE =================== */

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action) => {
        localStorage.setItem("currentWorkspaceId", action.payload);
        state.currentWorkspace =
            state.workspaces.find((w) => w.id === action.payload) || null;
        },

        addWorkspace: (state, action) => {
        state.workspaces.push(action.payload);
        state.currentWorkspace = action.payload;
        localStorage.setItem("currentWorkspaceId", action.payload.id);
        },

        updateWorkspace: (state, action) => {
        const index = state.workspaces.findIndex(
            (w) => w.id === action.payload.id
        );

        if (index !== -1) {
            state.workspaces[index] = action.payload;
        }

        if (state.currentWorkspace?.id === action.payload.id) {
            state.currentWorkspace = action.payload;
        }
        },

        deleteWorkspace: (state, action) => {
        state.workspaces = state.workspaces.filter(
            (w) => w.id !== action.payload
        );

        if (state.currentWorkspace?.id === action.payload) {
            state.currentWorkspace = state.workspaces[0] || null;
        }
        },

        addProject: (state, action) => {
        state.currentWorkspace?.projects.push(action.payload);
        },

        addTask: (state, action) => {
        const { projectId } = action.payload;

        const project = state.currentWorkspace?.projects.find(
            (p) => p.id === projectId
        );

        project?.tasks.push(action.payload);
        },

        updateTask: (state, action) => {
        const { projectId, id } = action.payload;

        const project = state.currentWorkspace?.projects.find(
            (p) => p.id === projectId
        );

        if (!project) return;

        const index = project.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
            project.tasks[index] = action.payload;
        }
        },

        deleteTask: (state, action) => {
        const { projectId, taskIds } = action.payload;

        const project = state.currentWorkspace?.projects.find(
            (p) => p.id === projectId
        );

        if (!project) return;

        project.tasks = project.tasks.filter(
            (t) => !taskIds.includes(t.id)
        );
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchWorkspaces.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchWorkspaces.fulfilled, (state, action) => {
            state.workspaces = action.payload;
            state.loading = false;

            if (action.payload.length > 0) {
            const savedId = localStorage.getItem("currentWorkspaceId");
            state.currentWorkspace =
                action.payload.find((w) => w.id === savedId) ||
                action.payload[0];
            }
        })
        .addCase(fetchWorkspaces.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

/* =================== EXPORTS =================== */

export const {
    setCurrentWorkspace,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addProject,
    addTask,
    updateTask,
    deleteTask,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
