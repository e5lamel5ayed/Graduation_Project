import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/add_task_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/add_task_state.dart';
import 'package:rewarding_kids/features/parent/data/add_task_model.dart';
import 'package:rewarding_kids/features/parent/widgets/TaskActions.dart';

class TaskSelectCard extends StatelessWidget {
  final AddTaskModel task;

  const TaskSelectCard({super.key, required this.task});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AddTaskCubit, AddTaskState>(
      builder: (context, state) {
        final isSelected =
            state.selectedTask != null && state.selectedTask!.id == task.id;

        return Column(
          children: [
            GestureDetector(
              onTap: () {
                context.read<AddTaskCubit>().selectTask(task);
              },
              child: Container(
                width: MediaQuery.of(context).size.width * 0.9,

                margin: EdgeInsets.only(bottom: 16.h),
                padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
                decoration: BoxDecoration(
                  color: Color(0xffF8F4FA),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected
                        ? const Color(0xFF8A38F5)
                        : Colors.transparent,
                    width: 1,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CustomText(
                          text: task.title,
                          iscenter: true,
                          size: 16.sp,
                          color: AppColors.titleColor,
                          weight: FontWeight.w500,
                        ),
                      ],
                    ),
                    SizedBox(height: 6.h),
                    CustomText(
                      text: "Listen to a short story without interrupting.",
                      iscenter: true,
                      size: 12.sp,
                      color: AppColors.descColor,
                      weight: FontWeight.w400,
                    ),
                    SizedBox(height: 6.h),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              width: MediaQuery.of(context).size.width * 0.2,
                              //  height: MediaQuery.of(context).size.height * 0.03,
                              decoration: BoxDecoration(
                                color: Color(0xffE4E4E4),
                                borderRadius: BorderRadius.circular(8.r),
                              ),
                              child: CustomText(
                                text: task.category,
                                iscenter: true,
                                size: 14.sp,
                                color: Color(0xff60697B),
                                weight: FontWeight.w400,
                              ),
                            ),
                            SizedBox(width: 6.w),
                            Container(
                              width: MediaQuery.of(context).size.width * 0.2,
                              //  height: MediaQuery.of(context).size.height * 0.03,
                              decoration: BoxDecoration(
                                color: Color(0xffE4E4E4),
                                borderRadius: BorderRadius.circular(8.r),
                              ),
                              child: CustomText(
                                text: task.level,
                                iscenter: true,
                                size: 14.sp,
                                color: Color(0xff60697B),
                                weight: FontWeight.w400,
                              ),
                            ),
                          ],
                        ),

                        // SizedBox(height: 6.h),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 30.w,
                              height: 20.h,
                              //padding: EdgeInsets.all(4.w),
                              decoration: BoxDecoration(shape: BoxShape.circle),
                              child: Image.asset('assets/child/coins.png'),
                            ),
                            SizedBox(
                              width: 30.w,
                              height: 20.h,

                              child: CustomText(
                                text: "${task.rewardPoints}",
                                iscenter: true,
                                size: 14.sp,
                                color: Color(0xff394A59),
                                weight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    SizedBox(height: 10.h),
                  ],
                ),
              ),
            ),
            // 👇 الجزء اللي بيظهر تحت التاسك
            if (isSelected) TaskActions(),
          ],
        );
      },
    );
  }
}
