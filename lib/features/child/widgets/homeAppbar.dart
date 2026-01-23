import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/child/widgets/PointsProgressBar.dart';
import 'package:rewarding_kids/features/child/widgets/child_avatar.dart';
import 'package:rewarding_kids/features/child/widgets/coin.dart';

class HomeAppbar extends StatelessWidget {
  const HomeAppbar({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 50.h, // ارتفاع مناسب للـ Row
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          ChildAvatar(),
          SizedBox(width: 8.w),
          CustomText(
            text: 'Nilly',
            iscenter: false,
            size: 16.sp,
            weight: FontWeight.w500,
            color: AppColors.titleColor,
          ),
          SizedBox(width: 8.w),
          PointsProgressBar(),
          SizedBox(width: 8.w),
          Coin(),
        ],
      ),
    );
  }
}
