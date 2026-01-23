import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Skipbutton extends StatelessWidget {
  const Skipbutton({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go('/getstarted'),
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
        decoration: BoxDecoration(
          color: AppColors.buttonfillColor,
          borderRadius: BorderRadius.circular(26.r),
          border: Border.all(color: AppColors.buttonborderColor),
        ),
        child: Text(
          'Skip',
          style: TextStyle(
            fontSize: 16.sp,
            color: AppColors.titleColor,
          ),
        ),
      ),
    );
  }
}
