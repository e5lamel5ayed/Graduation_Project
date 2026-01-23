import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Taskstabs extends StatelessWidget {
  const Taskstabs({
    super.key,
    required this.widget1,
    required this.widget2,
    required this.widget3,
  });

  final Widget widget1;
  final Widget widget2;
  final Widget widget3;

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          /// TabBar
          TabBar(
            indicatorColor: AppColors.tasktabactive,
            indicatorWeight: 3,
            indicatorPadding: EdgeInsets.symmetric(vertical: 8.h, horizontal: 16.w),
            labelPadding: EdgeInsets.symmetric(vertical: 8.h, horizontal: 16.w),
            dividerColor: Colors.transparent,
            indicatorSize: TabBarIndicatorSize.tab,
            labelColor: AppColors.tabbarcolor,
            unselectedLabelColor: AppColors.tasktabnonactive,
            tabs: [
              Tab(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CustomText(text: "General", iscenter: false, size: 14.sp, weight: FontWeight.w400),
                    SizedBox(width: 6.w),
                    SizedBox(
                      width: 12.w,
                      height: 12.h,
                      child: SvgPicture.asset('assets/child/generaltask.svg'),
                    ),
                  ],
                ),
              ),
              Tab(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CustomText(text: "Parent", iscenter: false, size: 14.sp, weight: FontWeight.w400),
                    SizedBox(width: 6.w),
                    SizedBox(
                      width: 12.w,
                      height: 12.h,
                      child: SvgPicture.asset('assets/child/parenttask.svg'),
                    ),
                  ],
                ),
              ),
              Tab(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CustomText(text: "Institution", iscenter: false, size: 14.sp, weight: FontWeight.w400),
                    SizedBox(width: 6.w),
                    SizedBox(
                      width: 12.w,
                      height: 12.h,
                      child: SvgPicture.asset('assets/child/Institutiontask.svg'),
                    ),
                  ],
                ),
              ),
            ],
          ),

          /// TabBarView
          Expanded(
            child: TabBarView(
              children: [
                widget1, // Taskslist (ListView) يتعامل مع Scroll
                widget2,
                widget3,
              ],
            ),
          ),
        ],
      ),
    );
  }
}
