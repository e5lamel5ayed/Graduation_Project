import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/task_list_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/task_list_state.dart';
class StatusTabs extends StatelessWidget {
  const StatusTabs({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TaskListCubit, TaskListState>(
      builder: (context, state) {
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.all(12),
          child: Row(
            children: TaskStatus.values.map((status) {
              final isSelected = state.selectedStatus == status;
              return GestureDetector(
                onTap: () {
                  context.read<TaskListCubit>().changeStatus(status);
                },
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Color(0xff9A87A4)
                        : Color(0xffF8F4FA),
                    borderRadius: BorderRadius.circular(8.r),
                  ),
                  child: Text(
                    _statusText(status),
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.black,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        );
      },
    );
  }
}

String _statusText(TaskStatus status) {
  switch (status) {
    case TaskStatus.all:
      return 'All';
    case TaskStatus.inReview:
      return 'In Review';
    case TaskStatus.completed:
      return 'Completed';
    case TaskStatus.pending:
      return 'Pending';
    case TaskStatus.rejected:
      return 'Rejected';
  }
}
