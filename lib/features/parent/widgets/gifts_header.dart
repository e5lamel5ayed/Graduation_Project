import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class GiftsHeader extends StatelessWidget {
  const GiftsHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 300.h,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(40.r),
          bottomRight: Radius.circular(40.r),
        ),
        gradient: LinearGradient(
          colors: [Color(0xffBADCFC), Color(0xffF4D0FF)],
          begin: Alignment.topLeft,
          end: Alignment.topRight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 4, // ده الـ spread
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SvgPicture.asset('assets\icons\gift.svg', width: 40.w, height: 40.h),
          SizedBox(height: 8.h),
          CustomText(
            text: 'Gifts & Rewards',
            iscenter: true,
            color: AppColors.titleColor,
            weight: FontWeight.w500,
            size: 24.sp,
          ),
          SizedBox(height: 8.h),
          CustomText(
            text: 'Manage Gifts for Nilly',
            iscenter: true,
            color: AppColors.descColor,
            weight: FontWeight.w400,
            size: 14.sp,
          ),
          SizedBox(height: 20.h),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.w),
            child: Container(
              width: 165.w,
              height: 40.h,
              decoration: BoxDecoration(
                color: Color(0xffFAE588),
                borderRadius: BorderRadius.circular(8.r),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(
                    'assets\child\coins.png',
                    width: 16.w,
                    height: 16.h,
                  ),
                  SizedBox(width: 8.w),
                  CustomText(
                    text: '100',
                    iscenter: true,
                    color: AppColors.titleColor,
                    weight: FontWeight.w500,
                    size: 14.sp,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
