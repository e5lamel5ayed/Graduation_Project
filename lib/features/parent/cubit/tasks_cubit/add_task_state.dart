import 'package:flutter/material.dart';
import 'package:rewarding_kids/features/parent/data/add_task_model.dart';
import 'package:rewarding_kids/features/parent/data/task_form_model.dart';

class AddTaskState {
  final TaskFormModel form;
  final AddTaskModel? selectedTask;
  final DateTime? selectedDate; // بدل TimeOfDay

  const AddTaskState({
    required this.form,
    this.selectedTask,
    this.selectedDate,
  });

  factory AddTaskState.initial() {
    return const AddTaskState(
      form: TaskFormModel(),
      selectedTask: null,
      selectedDate: null,
    );
  }

  AddTaskState copyWith({
    TaskFormModel? form,
    AddTaskModel? selectedTask,
    DateTime? selectedDate,
  }) {
    return AddTaskState(
      form: form ?? this.form,
      selectedTask: selectedTask,
      selectedDate: selectedDate ?? this.selectedDate,
    );
  }

  bool get hasAnyFilter =>
      form.category != null || form.subCategory != null || form.level != null;

  bool get canAssign =>
      selectedTask != null && selectedDate != null; // بدل selectedTime
}
