import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class UserTypeTabs extends StatefulWidget {
  const UserTypeTabs({
    super.key,
    required this.widget1,
    required this.widget2,
    required this.widget3,
  });

  final Widget widget1;
  final Widget widget2;
  final Widget widget3;

  @override
  State<UserTypeTabs> createState() => _UserTypeTabsState();
}

class _UserTypeTabsState extends State<UserTypeTabs>
    with SingleTickerProviderStateMixin {
  late TabController controller;

  @override
  void initState() {
    super.initState();
    controller = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // ------- TAB BAR -------
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8.r),
          ),
          child: TabBar(
            controller: controller,
            indicator: BoxDecoration(
              color: AppColors.ActiveColor,
              borderRadius: BorderRadius.circular(8.r),
            ),
            labelColor: Colors.white,
            unselectedLabelColor: AppColors.titleColor,
            indicatorSize: TabBarIndicatorSize.tab,
            tabs: [
              Tab(child: Text("Parent", style: TextStyle(fontSize: 14.sp))),
              Tab(child: Text("Child", style: TextStyle(fontSize: 14.sp))),
              Tab(
                child: Text(
                  "Institution",
                  style: TextStyle(fontSize: 14.sp),
                ),
              ),
            ],
          ),
        ),

        SizedBox(height: 10.h),

        // ------- TAB VIEW -------
        Expanded(
          child: TabBarView(
            controller: controller,
            children: [
              widget.widget1,
              widget.widget2,
              widget.widget3,
            ],
          ),
        ),
      ],
    );
  }
}
