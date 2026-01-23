import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Popbutton extends StatelessWidget {
  final VoidCallback onPressed;
  const Popbutton({super.key, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: 32.w,
        height: 32.w,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: AppColors.buttonfillColor,
          borderRadius: BorderRadius.circular(6.r),
          border: Border.all(color: AppColors.buttonborderColor, width: 1.25.w),
        ),
        child: Icon(
          Icons.keyboard_arrow_left_outlined,
          size: 20.sp,
        ),
      ),
    );
  }
}
