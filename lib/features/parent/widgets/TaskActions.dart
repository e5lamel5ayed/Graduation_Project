import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/add_task_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/add_task_state.dart';

class TaskActions extends StatelessWidget {
  const TaskActions({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AddTaskCubit, AddTaskState>(
      builder: (context, state) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 8.h),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomText(
                text: "Due Date",
                iscenter: false,
                size: 16.sp,
                weight: FontWeight.w500,
                color: AppColors.titleColor,
              ),

              SizedBox(height: 8.h),

              /// Date Picker - TextFormField style
              SizedBox(
                width: double.infinity,
                height: 48.h,
                child: TextFormField(
                  readOnly: true,
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );

                    if (date != null) {
                      context.read<AddTaskCubit>().selectDate(date);
                    }
                  },
                  controller: TextEditingController(
                    text: state.selectedDate == null
                        ? ''
                        : '${state.selectedDate!.day}/${state.selectedDate!.month}/${state.selectedDate!.year}',
                  ),
                  decoration: InputDecoration(
                    prefixIcon: SvgPicture.asset('assets\icons\timeline.svg'),

                    hintText: 'Enter Due Date',
                    hintStyle: TextStyle(
                      color: AppColors.descColor,
                      fontSize: 14.sp,
                    ),

                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFF8A38F5)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),

              SizedBox(height: 20.h),

              /// Assign Button
              Custombutton(
                onPressed: state.canAssign
                    ? () => _showSuccessDialog(context)
                    : null,
                text: 'Assign the task to the child',
              ),
            ],
          ),
        );
      },
    );
  }
}

void _showSuccessDialog(BuildContext context) {
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (_) {
      return AlertDialog(
        actions: [
          SizedBox(
            height: 240.h,
            width: 290.w,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                  child: SizedBox(
                    height: 100.h,
                    width: 100.w,
                    child: Image.asset('assets/icons/done.png'),
                  ),
                ),
                SizedBox(height: 10.h),
                CustomText(
                  text: 'Task assigned Successfully!',
                  iscenter: true,
                  size: 14.sp,
                  weight: FontWeight.w500,
                  color: AppColors.titleColor,
                ),
                SizedBox(height: 10.h),
                Custombutton(
                  onPressed: () {
                    if (context.canPop()) {
                      context.pop();
                    } else {
                      context.go('/addtask');
                    }
                  },
                  text: 'Continue',
                ),
              ],
            ),
          ),
        ],
      );
    },
  );
}
