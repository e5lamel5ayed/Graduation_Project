import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/Shared/Customtextformfiled.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';

class Resetpass1View extends StatelessWidget {
  const Resetpass1View({super.key});

  @override
  Widget build(BuildContext context) {
    final newpassController = TextEditingController();
    final confirmnewpassController = TextEditingController();

    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        backgroundColor: AppColors.Background,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 12.h),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Popbutton(
                      onPressed: () {
                        if (context.canPop()) {
                          context.pop();
                        } else {
                          context.go('/otp1');
                        }
                      },
                    ),
                  ],
                ),
                SizedBox(height: 30.h),
                Center(
                  child: SvgPicture.asset(
                    'assets/icons/lock.svg',
                    width: 56.w,
                    height: 56.h,
                  ),
                ),
                SizedBox(height: 20.h),
                CustomText(
                  text: 'Reset Password',
                  iscenter: true,
                  color: AppColors.titleColor,
                  weight: FontWeight.w600,
                  size: 18.sp,
                ),
                SizedBox(height: 20.h),
                Customtextformfiled(
                  hint: '********',
                  isPassword: true,
                  controller: newpassController,
                  label: 'New Password',
                  icon: Icons.lock_outline_rounded,
                ),
                SizedBox(height: 10.h),
                Customtextformfiled(
                  hint: '********',
                  isPassword: true,
                  controller: confirmnewpassController,
                  label: 'Confirm New Password',
                  icon: Icons.lock_outline_rounded,
                ),
                SizedBox(height: 15.h),
                Row(
                  children: [
                    SizedBox(width: 20.w),
                    Icon(Icons.check_circle, color: AppColors.descColor, size: 18.sp),
                    SizedBox(width: 10.w),
                    Expanded(
                      child: CustomText(
                        text: 'Must Be At Least 8 Characters',
                        iscenter: false,
                        color: AppColors.descColor,
                        weight: FontWeight.w500,
                        size: 14.sp,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 15.h),
                Row(
                  children: [
                    SizedBox(width: 20.w),
                    Icon(Icons.check_circle, color: AppColors.descColor, size: 18.sp),
                    SizedBox(width: 10.w),
                    Expanded(
                      child: CustomText(
                        text: 'Must Contain One Special Character',
                        iscenter: false,
                        color: AppColors.descColor,
                        weight: FontWeight.w500,
                        size: 14.sp,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 25.h),
                Custombutton(
                  onPressed: () {
                    context.go('/resetpass2');
                  },
                  text: 'Reset',
                ),
                SizedBox(height: 30.h), // مساحة إضافية لتجنب overflow مع الكيبورد
              ],
            ),
          ),
        ),
      ),
    );
  }
}
