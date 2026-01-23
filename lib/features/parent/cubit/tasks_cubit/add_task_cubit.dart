import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';
import 'package:rewarding_kids/features/parent/data/add_task_model.dart';
import 'add_task_state.dart';
import 'package:rewarding_kids/features/parent/data/task_model.dart';

class AddTaskCubit extends Cubit<AddTaskState> {
  AddTaskCubit() : super(AddTaskState.initial());

  void selectCategory(String category) {
    emit(
      state.copyWith(
        form: state.form.copyWith(category: category, subCategory: null),
        selectedTask: null,
      ),
    );
  }

  void selectSubCategory(String subCategory) {
    emit(
      state.copyWith(
        form: state.form.copyWith(subCategory: subCategory),
        selectedTask: null,
      ),
    );
  }

  void selectLevel(String level) {
    emit(
      state.copyWith(
        form: state.form.copyWith(level: level),
        selectedTask: null,
      ),
    );
  }

  void selectTask(AddTaskModel task) {
    emit(
      state.copyWith(
        selectedTask: task,
        selectedDate: null, // كل Task ليها يوم جديد
      ),
    );
  }

  void selectDate(DateTime date) {
    emit(state.copyWith(selectedDate: date));
  }
}
