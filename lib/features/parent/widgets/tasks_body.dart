import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:rewarding_kids/features/parent/cubit/layout_cubit/tasks_view_cubit.dart';
import 'package:rewarding_kids/features/parent/views/add_task_screen.dart';
import 'package:rewarding_kids/features/parent/widgets/AddTaskButton.dart';
import 'package:rewarding_kids/features/parent/widgets/StatusTabs.dart';
import 'package:rewarding_kids/features/parent/widgets/tasks_list.dart';

class TasksBody extends StatelessWidget {
  const TasksBody({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TasksViewCubit, TasksPage>(
      builder: (context, state) {
        if (state == TasksPage.addTask) {
          return const AddTaskScreen();
        }

        return Column(
          children: [
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 16.h),
              child: SizedBox(
                width: MediaQuery.of(context).size.width * 0.9,
                height: MediaQuery.of(context).size.height * 0.04,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Popbutton(onPressed: () {}),
                    AddTaskButton(
                      onTap: () {
                        context.read<TasksViewCubit>().showAddTask();
                      },
                    ),
                    SvgPicture.asset(
                      "assets/icons/notification.svg",
                      width: 14.w,
                      height: 16.h,
                    ),
                  ],
                ),
              ),
            ),
            const StatusTabs(),
            const Expanded(child: TasksList()),
          ],
        );
      },
    );
  }
}
