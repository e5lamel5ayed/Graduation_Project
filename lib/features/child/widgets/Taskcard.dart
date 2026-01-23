import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import '../data/task_model.dart';

class Taskcard extends StatelessWidget {
  const Taskcard({super.key, required this.task});
  final TaskModel task;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // مثال التنقل حسب نوع المهمة
        if (task.isimage == false && task.issound == true) {
          GoRouter.of(context).push('/voice_task', extra: task);
        } else if (task.isimage == true && task.issound == false) {
          GoRouter.of(context).push('/take_image', extra: task);
        } else {
          GoRouter.of(context).push('/task_view', extra: task);
        }
      },
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: 10.h, horizontal: 5.w),
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: AppColors.cardcolor,
            borderRadius: BorderRadius.circular(16.r),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  SizedBox(
                    width: 250.w,
                    height: 55.h,
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16.w),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Align(
                            alignment: Alignment.topLeft,
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: CustomText(
                                text: task.TaskTitle,
                                iscenter: false,
                                size: 16.sp,
                                weight: FontWeight.w500,
                                color: AppColors.titleColor,
                              ),
                            ),
                          ),
                          SizedBox(height: 10.h),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              CustomText(
                                text: 'Reward:',
                                iscenter: true,
                                size: 12.sp,
                                weight: FontWeight.w400,
                                color: AppColors.descColor,
                              ),
                              Padding(
                                padding: EdgeInsets.only(left: 30.w),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 20.w,
                                      height: 20.h,
                                      padding: EdgeInsets.all(4.w),
                                      child: Image.asset(
                                        'assets/child/coins.png',
                                      ),
                                    ),
                                    CustomText(
                                      text: '${task.point}',
                                      iscenter: true,
                                      size: 14.sp,
                                      weight: FontWeight.w500,
                                      color: AppColors.titleColor,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(vertical: 15.h),
                    child: Container(
                      width: MediaQuery.of(context).size.width * 0.18,
                      height: MediaQuery.of(context).size.height * 0.081,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8.r),
                        child: Image.asset(task.image, fit: BoxFit.fill),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
