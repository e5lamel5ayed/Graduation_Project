import 'package:flutter_bloc/flutter_bloc.dart';
import 'task_list_state.dart';

class TaskListCubit extends Cubit<TaskListState> {
  TaskListCubit() : super(const TaskListState());

  void changeStatus(TaskStatus status) {
    emit(TaskListState(selectedStatus: status));
  }
}
