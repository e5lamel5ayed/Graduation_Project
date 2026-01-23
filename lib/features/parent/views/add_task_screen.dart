import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/add_task_cubit.dart';
import 'package:rewarding_kids/features/parent/widgets/addtask_appar.dart';
import 'package:rewarding_kids/features/parent/widgets/addtask_body.dart';
import 'package:rewarding_kids/features/parent/widgets/custom_bottom_nav.dart';

import '../widgets/category_section.dart';
import '../widgets/subcategory_section.dart';
import '../widgets/level_section.dart';

class AddTaskScreen extends StatelessWidget {
  const AddTaskScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: AppColors.Background,

        body: AddTaskBody(),
      ),
    );
  }
}
