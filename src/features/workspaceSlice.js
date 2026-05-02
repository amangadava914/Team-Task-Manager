import { createSlice } from "@reduxjs/toolkit";
import { dummyWorkspaces } from "../assets/assets";

const WORKSPACE_STATE_KEY = "projectWorkspaceState";

const loadWorkspaceState = () => {
    try {
        const stored = localStorage.getItem(WORKSPACE_STATE_KEY);
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        if (parsed?.workspaces && Array.isArray(parsed.workspaces)) {
            return parsed;
        }
    } catch (error) {
        console.warn("Unable to load workspace state from localStorage", error);
    }
    return null;
};

const saveWorkspaceState = (state) => {
    try {
        const payload = {
            workspaces: state.workspaces,
            currentWorkspaceId: state.currentWorkspace?.id,
        };
        localStorage.setItem(WORKSPACE_STATE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.warn("Unable to save workspace state to localStorage", error);
    }
};

const persistedWorkspaceState = loadWorkspaceState();
const workspaces = persistedWorkspaceState?.workspaces || dummyWorkspaces || [];
const currentWorkspaceId = persistedWorkspaceState?.currentWorkspaceId || localStorage.getItem("currentWorkspaceId") || workspaces[1]?.id || workspaces[0]?.id;
const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0] || null;

const initialState = {
    workspaces,
    currentWorkspace,
    loading: false,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload;
            saveWorkspaceState(state);
        },
        setCurrentWorkspace: (state, action) => {
            localStorage.setItem("currentWorkspaceId", action.payload);
            state.currentWorkspace = state.workspaces.find((w) => w.id === action.payload);
            saveWorkspaceState(state);
        },
        addWorkspace: (state, action) => {
            state.workspaces.push(action.payload);

            // set current workspace to the new workspace
            if (state.currentWorkspace?.id !== action.payload.id) {
                state.currentWorkspace = action.payload;
            }
            saveWorkspaceState(state);
        },
        updateWorkspace: (state, action) => {
            state.workspaces = state.workspaces.map((w) =>
                w.id === action.payload.id ? action.payload : w
            );

            // if current workspace is updated, set it to the updated workspace
            if (state.currentWorkspace?.id === action.payload.id) {
                state.currentWorkspace = action.payload;
            }
            saveWorkspaceState(state);
        },
        deleteWorkspace: (state, action) => {
            state.workspaces = state.workspaces.filter((w) => w._id !== action.payload);
            saveWorkspaceState(state);
        },
        addWorkspaceMember: (state, action) => {
            if (!state.currentWorkspace) return;

            const { member } = action.payload;
            if (!Array.isArray(state.currentWorkspace.members)) {
                state.currentWorkspace.members = [];
            }
            state.currentWorkspace.members.push(member);

            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id
                    ? { ...w, members: Array.isArray(w.members) ? w.members.concat(member) : [member] }
                    : w
            );
            saveWorkspaceState(state);
        },
        addProject: (state, action) => {
            if (!state.currentWorkspace) return;

            const project = action.payload;

            if (!Array.isArray(state.currentWorkspace.projects)) {
                state.currentWorkspace.projects = [];
            }
            state.currentWorkspace.projects.push(project);

            state.workspaces = state.workspaces.map((w) => {
                if (w.id === state.currentWorkspace.id) {
                    const projects = Array.isArray(w.projects) ? w.projects.concat(project) : [project];
                    return { ...w, projects };
                }
                return w;
            });
            saveWorkspaceState(state);
        },
        updateProject: (state, action) => {
            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) =>
                p.id === action.payload.id ? action.payload : p
            );
            // find workspace and update project in it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.id ? action.payload : p
                    )
                } : w
            );
            saveWorkspaceState(state);
        },
        addTask: (state, action) => {

            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                console.log(p.id, action.payload.projectId, p.id === action.payload.projectId);
                if (p.id === action.payload.projectId) {
                    if (!Array.isArray(p.tasks)) {
                        p.tasks = [];
                    }
                    p.tasks.push(action.payload);
                }
                return p;
            });

            // find workspace and project by id and add task to it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.projectId ? { ...p, tasks: p.tasks.concat(action.payload) } : p
                    )
                } : w
            );
            saveWorkspaceState(state);
        },
        updateTask: (state, action) => {
            state.currentWorkspace.projects.map((p) => {
                if (p.id === action.payload.projectId) {
                    p.tasks = p.tasks.map((t) =>
                        t.id === action.payload.id ? action.payload : t
                    );
                }
                return p;
            });
            // find workspace and project by id and update task in it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.projectId ? {
                            ...p, tasks: p.tasks.map((t) =>
                                t.id === action.payload.id ? action.payload : t
                            )
                        } : p
                    )
                } : w
            );
            saveWorkspaceState(state);
        },
        deleteTask: (state, action) => {
            state.currentWorkspace.projects.map((p) => {
                p.tasks = p.tasks.filter((t) => !action.payload.includes(t.id));
                return p;
            });
            // find workspace and project by id and delete task from it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.projectId ? {
                            ...p, tasks: p.tasks.filter((t) => !action.payload.includes(t.id))
                        } : p
                    )
                } : w
            );
            saveWorkspaceState(state);
        }

    }
});

export const { setWorkspaces, setCurrentWorkspace, addWorkspace, updateWorkspace, deleteWorkspace, addWorkspaceMember, addProject, updateProject, addTask, updateTask, deleteTask } = workspaceSlice.actions;
export default workspaceSlice.reducer;