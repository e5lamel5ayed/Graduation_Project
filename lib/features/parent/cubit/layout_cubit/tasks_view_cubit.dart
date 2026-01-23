import 'package:flutter_bloc/flutter_bloc.dart';

enum TasksPage {
  list,
  addTask,
}

class TasksViewCubit extends Cubit<TasksPage> {
  TasksViewCubit() : super(TasksPage.list);

  void showAddTask() => emit(TasksPage.addTask);
  void showList() => emit(TasksPage.list);
}
