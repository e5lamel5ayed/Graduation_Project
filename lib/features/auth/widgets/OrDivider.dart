import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Ordivider extends StatelessWidget {
  const Ordivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: AppColors.ActiveColor,
            thickness: 1.w,
            endIndent: 10.w,
          ),
        ),
        CustomText(
          text: "Or",
          iscenter: true,
          size: 16.sp,
          color: AppColors.ActiveColor,
        ),
        Expanded(
          child: Divider(
            color: AppColors.ActiveColor,
            thickness: 1.w,
            indent: 10.w,
          ),
        ),
      ],
    );
  }
}
