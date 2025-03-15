import { computed, ref } from "vue";
import type { ToastProps } from ".";
import type { Component, VNode } from "vue";

// Maximum number of toasts to show at once
const TOAST_LIMIT = 1;
// Default delay in ms before removing toast from DOM after dismissal
const TOAST_REMOVE_DELAY = 5000;

/**
 * Type representing content that can be rendered in a toast
 * Supports plain strings, Vue VNodes, or functions returning VNodes
 */
export type StringOrVNode = string | VNode | (() => VNode);

/**
 * Extended toast properties with internal fields
 * Adds id and optional fields for title, description, and action components
 */
type ToasterToast = ToastProps & {
  id: string;
  title?: string;
  description?: StringOrVNode;
  action?: Component;
};

/**
 * Action types for toast state management
 * Used to identify different operations in the dispatch function
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST", // Add a new toast
  UPDATE_TOAST: "UPDATE_TOAST", // Update an existing toast
  DISMISS_TOAST: "DISMISS_TOAST", // Mark a toast for dismissal
  REMOVE_TOAST: "REMOVE_TOAST", // Remove a toast from the DOM
} as const;

// Counter for generating unique toast IDs
let count = 0;

/**
 * Generates a unique ID for each toast
 * Uses a simple counter that wraps around at MAX_VALUE
 * @returns A unique string ID
 */
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

/**
 * State interface for the toast system
 * Maintains an array of active toasts
 */
type State = {
  toasts: ToasterToast[];
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Adds a toast to the removal queue
 * Sets a timeout to remove the toast after TOAST_REMOVE_DELAY
 * @param toastId - ID of the toast to remove
 */
function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

/**
 * State interface for the toast system
 * Maintains an array of active toasts
 */
const state = ref<State>({
  toasts: [],
});

/**
 * Dispatches actions to modify the toast state
 * Handles adding, updating, dismissing, and removing toasts
 * @param action - The action to dispatch
 */
function dispatch(action: Action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      state.value.toasts = [action.toast, ...state.value.toasts].slice(0, TOAST_LIMIT);
      break;

    case actionTypes.UPDATE_TOAST:
      state.value.toasts = state.value.toasts.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );
      break;

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.value.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      state.value.toasts = state.value.toasts.map((t) =>
        t.id === toastId || toastId === undefined
          ? {
              ...t,
              open: false,
            }
          : t
      );
      break;
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) state.value.toasts = [];
      else state.value.toasts = state.value.toasts.filter((t) => t.id !== action.toastId);

      break;
  }
}

/**
 * Composable for creating and managing toasts
 * Provides functions to create, update, and dismiss toasts
 * @returns Object with toast function and current toasts
 */
function useToast() {
  return {
    toasts: computed(() => state.value.toasts),
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

type Toast = Omit<ToasterToast, "id">;

/**
 * Creates a new toast with the given properties
 * @param props - Toast properties (title, description, etc.)
 * @returns Object with functions to update or dismiss the toast
 */
function toast(props: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

export { toast, useToast };
