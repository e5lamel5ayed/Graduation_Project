import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/task_list_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/task_list_state.dart';
import 'package:rewarding_kids/features/parent/data/task_model.dart';
import 'package:rewarding_kids/features/parent/widgets/task_card.dart';

class TasksList extends StatelessWidget {
  const TasksList({super.key});

  @override
  Widget build(BuildContext context) {
    final tasks = Tasks; // تأكدي إن دي List<TaskModel>

    return BlocBuilder<TaskListCubit, TaskListState>(
      builder: (context, state) {
        final filteredTasks = state.selectedStatus == TaskStatus.all
            ? tasks
            : tasks
                .where((task) => task.status == state.selectedStatus)
                .toList();

        if (filteredTasks.isEmpty) {
          return const Center(
            child: Text('No tasks'),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(12),
          itemCount: filteredTasks.length,
          itemBuilder: (context, index) {
            return TaskCard(
              task: filteredTasks[index],
            );
          },
        );
      },
    );
  }
}
