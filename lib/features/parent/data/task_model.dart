import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/task_list_state.dart';

class TaskModel {
  final String title;
  final String category;
  final String level;
  final TaskStatus status;
  final int rewardPoints ;

  TaskModel({
    required this.title,
    required this.category,
    required this.level,
    required this.status, required this.rewardPoints,
  });
}

final List<TaskModel> Tasks = [
    TaskModel(
    title: 'Listen to Someone',
    category: 'Social',
    level: 'Medium',
    status: TaskStatus.completed,
     rewardPoints: 10,
  ),
  TaskModel(
    title: 'Solve 5 Additions',
    category: 'Academic',
    level: 'Easy',
    status: TaskStatus.pending,
     rewardPoints: 10,
  ),
  TaskModel(
    title: 'Clean your room',
    category: 'Behavior',
    level: 'Medium',
    status: TaskStatus.inReview,
     rewardPoints: 10,
  ),
  TaskModel(
    title: 'Listen to Someone',
    category: 'Social',
    level: 'Medium',
    status: TaskStatus.rejected,
     rewardPoints: 10,
  ),
  TaskModel(
    title: 'Solve 5 Additions',
    category: 'Academic',
    level: 'Easy',
    status: TaskStatus.pending,
     rewardPoints: 10,
  ),
  TaskModel(
    title: 'Clean your room',
    category: 'Behavior',
    level: 'Medium',
    status: TaskStatus.inReview,
     rewardPoints: 10,
  ),
    TaskModel(
    title: 'Listen to Someone',
    category: 'Social',
    level: 'Medium',
    status: TaskStatus.completed,
     rewardPoints: 10,
  ),
  TaskModel(
    title: 'Solve 5 Additions',
    category: 'Academic',
    level: 'Easy',
    status: TaskStatus.pending,
     rewardPoints: 10,
  ),
  TaskModel(
    title: 'Clean your room',
    category: 'Behavior',
    level: 'Medium',
    status: TaskStatus.rejected, rewardPoints: 10,
  ),
];
