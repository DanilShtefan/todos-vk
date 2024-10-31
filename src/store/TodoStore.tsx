import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

export class Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;

  constructor(id: number, userId: number, title: string, completed: boolean) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.completed = completed;
    makeAutoObservable(this);
  }

  setTitle(newTitle: string) {
    this.title = newTitle;
  }

  toggleCompletion() {
    this.completed = !this.completed;
  }
}

class TodoStore {
  todos: Todo[] = [];
  isLoading = false;
  hasMore = true;
  page = 1;

  constructor() {
    makeAutoObservable(this);
  }

  fetchTodos = async () => {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/todos?_page=${this.page}&_limit=30`
      );

      runInAction(() => {
        this.todos = [
          ...this.todos,
          ...response.data.map(
            (todoData: Todo) =>
              new Todo(
                todoData.id,
                todoData.userId,
                todoData.title,
                todoData.completed
              )
          ),
        ];
        this.page += 1;
        if (response.data.length < 10) {
          this.hasMore = false;
        }
      });
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  editTodoTitle = (id: number, newTitle: string) => {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      runInAction(() => {
        todo.setTitle(newTitle);
      });
    }
  };

  toggleTodoCompletion = (id: number) => {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      runInAction(() => {
        todo.toggleCompletion();
      });
    }
  };

  deleteTodo = (id: number) => {
    runInAction(() => {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    });
  };
}

export const todoStore = new TodoStore();
