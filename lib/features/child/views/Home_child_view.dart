import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';
import 'package:rewarding_kids/features/child/views/GiftScreen.dart';
import 'package:rewarding_kids/features/child/views/MedalScreen.dart';
import 'package:rewarding_kids/features/child/widgets/Navicon.dart';
import 'package:rewarding_kids/features/child/widgets/homeAppbar.dart';
import 'package:rewarding_kids/features/child/widgets/taskstabs.dart';

import '../widgets/taskslist.dart';

class HomeChildView extends StatelessWidget {
  const HomeChildView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: AppColors.Background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal:16 .w, vertical: 16.h),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              HomeAppbar(),
            //  SizedBox(height: 10.h),
              Expanded(
                child: Taskstabs(widget1: Taskslist(tasks: GeneralTasks),
                    widget2:Taskslist(tasks: ParentTasks) ,widget3: Container(
                  height: 66,
                  color: Colors.grey,
                )),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
