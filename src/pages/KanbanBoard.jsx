import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, MessageSquare, Paperclip, Calendar, Trash2, Edit2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Breadcrumb from '../components/UI/Breadcrumb';
import Button from '../components/UI/Button';
import Avatar from '../components/UI/Avatar';
import Card from '../components/UI/Card';
import DropdownMenu from '../components/UI/DropdownMenu';
import Modal from '../components/UI/Modal';
import { Input } from '../components/UI/FormElements';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import { useToast } from '../components/UI/Toast';
import { theme } from '../theme/constants';

const INITIAL_BOARD = {
  todo: {
    id: 'todo',
    title: 'To Do',
    color: '#6b7280',
    tasks: [
      { id: 't1', title: 'Design new landing page', tags: ['Design', 'High Priority'], due: 'Apr 30', comments: 3, attachments: 2, users: ['Alex Johnson', 'Sarah Williams'] },
      { id: 't2', title: 'Update dependencies to React 19', tags: ['Tech Debt'], due: 'May 02', comments: 0, attachments: 0, users: ['Michael Brown'] },
    ]
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    color: theme.primary,
    tasks: [
      { id: 't3', title: 'Implement Universal Dashboard Template', tags: ['Feature', 'Epic'], due: 'Apr 29', comments: 12, attachments: 4, users: ['Ankit Jatav'] },
      { id: 't4', title: 'Fix navigation layout on mobile', tags: ['Bug'], due: 'May 01', comments: 2, attachments: 1, users: ['Sarah Williams'] },
    ]
  },
  review: {
    id: 'review',
    title: 'In Review',
    color: '#f59e0b',
    tasks: [
      { id: 't5', title: 'Integrate AdMob API', tags: ['Backend'], due: 'Apr 28', comments: 5, attachments: 0, users: ['Michael Brown', 'Alex Johnson'] },
    ]
  },
  done: {
    id: 'done',
    title: 'Done',
    color: '#16a34a',
    tasks: [
      { id: 't6', title: 'Create UI Component Library', tags: ['Design System', 'Epic'], due: 'Apr 27', comments: 8, attachments: 0, users: ['Ankit Jatav'] },
      { id: 't7', title: 'Setup Vite project structure', tags: ['Infrastructure'], due: 'Apr 25', comments: 1, attachments: 0, users: ['Michael Brown'] },
    ]
  }
};

const KanbanBoard = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState('todo');
  const [taskForm, setTaskForm] = useState({ title: '', tags: '' });
  const toast = useToast();

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      const originalOverflow = main.style.overflow;
      main.style.overflow = 'hidden';
      return () => { main.style.overflow = originalOverflow; };
    }
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = board[source.droppableId];
    const destCol = board[destination.droppableId];

    const sourceTasks = [...sourceCol.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destCol.tasks];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    const newBoard = {
      ...board,
      [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
      [destination.droppableId]: { ...destCol, tasks: destTasks }
    };

    setBoard(newBoard);
    if (source.droppableId !== destination.droppableId) {
      toast.success('Task Moved', `Moved to ${destCol.title}`);
    }
  };

  const handleOpenModal = (columnId, task = null) => {
    setActiveColumn(columnId);
    if (task) {
      setEditingTask(task);
      setTaskForm({ title: task.title, tags: task.tags.join(', ') });
    } else {
      setEditingTask(null);
      setTaskForm({ title: '', tags: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskForm.title) return;

    const newBoard = { ...board };
    if (editingTask) {
      Object.keys(newBoard).forEach(colId => {
        newBoard[colId].tasks = newBoard[colId].tasks.map(t =>
          t.id === editingTask.id ? { ...t, title: taskForm.title, tags: taskForm.tags.split(',').map(s => s.trim()) } : t
        );
      });
      toast.success('Updated', 'Task updated successfully');
    } else {
      const newTask = {
        id: `t-${Date.now()}`,
        title: taskForm.title,
        tags: taskForm.tags.split(',').map(s => s.trim()),
        due: 'May 05',
        comments: 0,
        attachments: 0,
        users: ['Ankit Jatav']
      };
      newBoard[activeColumn].tasks = [...newBoard[activeColumn].tasks, newTask];
      toast.success('Created', 'Task added to ' + board[activeColumn].title);
    }

    setBoard(newBoard);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    const newBoard = { ...board };
    Object.keys(newBoard).forEach(colId => {
      newBoard[colId].tasks = newBoard[colId].tasks.filter(t => t.id !== editingTask.id);
    });
    setBoard(newBoard);
    setIsDeleteOpen(false);
    toast.error('Deleted', 'Task removed');
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{ flexShrink: 0 }}>
        <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Kanban Board' }]} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 mt-2 gap-4 sm:gap-0">
          <div>
            <h1 style={{ fontSize: theme.fontSizeH1, fontWeight: theme.fontWeightBold, color: theme.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>Kanban Board</h1>
            <p style={{ fontSize: theme.fontSizeBody, color: theme.textMuted, margin: '4px 0 0 0' }}>Manage and track your project tasks.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: -8 }}>
              <Avatar name="Ankit" size="sm" />
              <Avatar name="Sarah" size="sm" />
              <Avatar name="Alex" size="sm" />
            </div>
            <Button variant="primary" onClick={() => handleOpenModal('todo')} className="w-full sm:w-auto justify-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> New Task
            </Button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            style={{
              display: 'flex',
              gap: 20,
              flex: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              paddingBottom: 8,
              paddingRight: 4,
              WebkitOverflowScrolling: 'touch'
            }}
            className="custom-scrollbar"
          >
            {Object.values(board).map(column => (
              <div key={column.id} style={{ minWidth: 300, width: 300, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  background: '#f8fafc',
                  borderRadius: 12,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  border: `1px solid ${theme.cardBorder}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: column.color }} />
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary }}>{column.title}</h2>
                      <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>{column.tasks.length}</span>
                    </div>
                    <button style={{ color: theme.textMuted, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}
                        className="custom-scrollbar"
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  background: theme.cardBg,
                                  border: `1px solid ${snapshot.isDragging ? theme.primary : theme.cardBorder}`,
                                  borderRadius: 10,
                                  padding: 16,
                                  marginBottom: 12,
                                  boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.02)',
                                  transition: 'background-color 0.2s, border-color 0.2s',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    {task.tags.map(tag => (
                                      <span key={tag} style={{
                                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                                        background: '#f1f5f9', color: '#475569'
                                      }}>
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <DropdownMenu items={[
                                    { label: 'Edit', icon: Edit2, onClick: () => handleOpenModal(column.id, task) },
                                    { label: 'Delete', icon: Trash2, danger: true, onClick: () => { setEditingTask(task); setIsDeleteOpen(true); } },
                                  ]}>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted }}>
                                      <MoreHorizontal size={14} />
                                    </button>
                                  </DropdownMenu>
                                </div>

                                <h3 style={{ fontSize: 14, fontWeight: 600, color: theme.textPrimary, marginBottom: 12, lineHeight: 1.4 }}>
                                  {task.title}
                                </h3>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.textMuted }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11 }}>
                                      <Calendar size={12} /> {task.due}
                                    </div>
                                    {task.comments > 0 && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11 }}>
                                        <MessageSquare size={12} /> {task.comments}
                                      </div>
                                    )}
                                  </div>

                                  <div style={{ display: 'flex' }}>
                                    {task.users.map((u, i) => (
                                      <div key={u} style={{ marginLeft: i > 0 ? -6 : 0 }}>
                                        <Avatar name={u} size="xs" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        <button
                          onClick={() => handleOpenModal(column.id)}
                          style={{
                            width: '100%', padding: '10px',
                            background: 'transparent', border: `2px dashed ${theme.cardBorder}`,
                            borderRadius: 8, color: theme.textMuted, fontSize: 13, fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={14} /> Add Card
                        </button>
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        footer={
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveTask}>Save</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Title</label>
            <Input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary, marginBottom: 6, display: 'block' }}>Tags</label>
            <Input value={taskForm.tags} onChange={e => setTaskForm({ ...taskForm, tags: e.target.value })} placeholder="e.g. Design, High Priority" style={{ width: '100%' }} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Permanently remove this task?"
        type="delete"
      />
    </div>
  );
};

export default KanbanBoard;
