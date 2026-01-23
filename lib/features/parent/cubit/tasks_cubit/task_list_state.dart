enum TaskStatus { all, inReview, completed, pending, rejected }

class TaskListState {
  final TaskStatus selectedStatus;

  const TaskListState({this.selectedStatus = TaskStatus.all});
}
