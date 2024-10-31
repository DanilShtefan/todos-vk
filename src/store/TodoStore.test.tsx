import { Todo, todoStore } from './TodoStore';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

describe('TodoStore', () => {
  beforeEach(() => {
    todoStore.todos = []; // Сброс списка задач перед каждым тестом
    todoStore.isLoading = false;
    todoStore.hasMore = true;
    todoStore.page = 1;
  });

  test('fetchTodos should load todos', async () => {
    const todosMock = [
      { id: 1, userId: 1, title: 'Todo 1', completed: false },
      { id: 2, userId: 1, title: 'Todo 2', completed: true },
    ];

    mockAxios.onGet('https://jsonplaceholder.typicode.com/todos?_page=1&_limit=30').reply(200, todosMock);

    await todoStore.fetchTodos();

    expect(todoStore.todos.length).toBe(2);
    expect(todoStore.todos[0].title).toBe('Todo 1');
  });

  test('fetchTodos should not fetch if loading', async () => {
    todoStore.isLoading = true;
    await todoStore.fetchTodos();

    expect(todoStore.todos.length).toBe(0);
  });


  test('deleteTodo should remove the todo', () => {
    const todo = { id: 1, userId: 1, title: 'Todo 1', completed: false };
    todoStore.todos.push(todo as Todo);

    todoStore.deleteTodo(1);

    expect(todoStore.todos.length).toBe(0);
  });

  test('fetchTodos should set hasMore to false if less than 10 todos are returned', async () => {
    const todosMock = [{ id: 1, userId: 1, title: 'Todo 1', completed: false }];

    mockAxios.onGet('https://jsonplaceholder.typicode.com/todos?_page=1&_limit=30').reply(200, todosMock);

    await todoStore.fetchTodos();

    expect(todoStore.hasMore).toBe(false);
  });
});
