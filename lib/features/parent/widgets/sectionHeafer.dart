import'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class SectionHeader extends StatelessWidget {
  final String title;
  final String icon;

  const SectionHeader({
    super.key,
    required this.title,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        SvgPicture.asset(
          icon,
          width: 24.w,
          height: 24.h,
        ),
        SizedBox(width: 8.w),
        CustomText(
          text: title,
          size: 15.sp,
          weight: FontWeight.w500,
          color: AppColors.titleColor, iscenter: true,
        ),
      ],
    );
  }
}
