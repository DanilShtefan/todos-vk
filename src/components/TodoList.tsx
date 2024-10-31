import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { todoStore } from "../store/TodoStore";
import { List, Button, Checkbox, Input, Spin } from "antd";

const TodoList: React.FC = observer(() => {
  const { todos, fetchTodos, editTodoTitle, toggleTodoCompletion, deleteTodo, isLoading } = todoStore;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container && container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      fetchTodos();
    }
  };

  const startEditing = (id: number, title: string) => {
    setEditingId(id);
    setNewTitle(title);
  };

  const saveEdit = (id: number) => {
    editTodoTitle(id, newTitle);
    setEditingId(null);
  };

  return (
    <div
      ref={scrollContainerRef}
      style={{ overflowY: "auto", maxHeight: "80vh", padding: "16px" }}
      onScroll={handleScroll}
    >
      <List
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Checkbox
                checked={todo.completed}
                onChange={() => toggleTodoCompletion(todo.id)}
              >
                Completed
              </Checkbox>,
              <Button type="link" onClick={() => startEditing(todo.id, todo.title)}>Edit</Button>,
              <Button type="link" danger onClick={() => deleteTodo(todo.id)}>Delete</Button>
            ]}
          >
            <List.Item.Meta
              title={
                editingId === todo.id ? (
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => saveEdit(todo.id)}
                    onPressEnter={() => saveEdit(todo.id)}
                    autoFocus
                  />
                ) : (
                  <span onDoubleClick={() => startEditing(todo.id, todo.title)}>
                    {todo.title}
                  </span>
                )
              }
              description={`User ID: ${todo.userId}`}
            />
          </List.Item>
        )}
      />
      {isLoading && (
        <div style={{ textAlign: "center", padding: "12px" }}>
          <Spin />
        </div>
      )}
    </div>
  );
});

export default TodoList;
