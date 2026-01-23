import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';
import 'package:rewarding_kids/features/child/widgets/CameraInContainer.dart';
import 'package:rewarding_kids/features/child/widgets/homeAppbar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';

class Takeimage extends StatelessWidget {
  const Takeimage({super.key, required this.Taskdetails});
 final TaskModel Taskdetails;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
          child: Column(
            children: [
              Row(
                children: [
                  Popbutton(
                    onPressed: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/home_child');
                      }
                    },
                  ),
                  SizedBox(width: 70.w),
                  CustomText(
                    text: Taskdetails.TaskTitle,
                    iscenter: true,
                    size: 20.sp,
                    color: AppColors.titleColor,
                    weight: FontWeight.w600,
                  ),
                ],
              ),
              SizedBox(height: 25.h),
              HomeAppbar(),
              SizedBox(height: 30.h),
              /// Expanded لتجنب overflow
              Expanded(
                child: CameraInContainer(Taskdetails: Taskdetails),
              ),
            ],
          ),
        ),
      ),
    );
  }
}