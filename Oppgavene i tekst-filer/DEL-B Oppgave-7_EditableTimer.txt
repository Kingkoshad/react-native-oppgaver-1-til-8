
import React from 'react';
import TimerForm from './TimerForm';
import Timer from './Timer';

export default function EditableTimer({
  id,
  title,
  project,
  elapsed,
  isRunning,
  editFormOpen,
  onToggle,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}) {
  if (editFormOpen) {
    return (
      <TimerForm
        id={id}
        title={title}
        project={project}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <Timer
      title={title}
      project={project}
      elapsed={elapsed}
      isRunning={isRunning}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
