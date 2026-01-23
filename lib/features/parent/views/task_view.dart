import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/parent/cubit/layout_cubit/tasks_view_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/task_list_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/task_list_state.dart';
import 'package:rewarding_kids/features/parent/widgets/tasks_body.dart';

class TasksView extends StatelessWidget {
  const TasksView({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => TaskListCubit()),
        BlocProvider(create: (_) => TasksViewCubit()),
      ],
      child: const TasksBody(),
    );
  }
}
