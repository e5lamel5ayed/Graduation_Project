import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';

class Resetpass2View extends StatelessWidget {
  const Resetpass2View({super.key});

  @override
  Widget build(BuildContext context) {
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
                          context.go('/login');
                        }
                      },
                    ),
                  ],
                ),
                SizedBox(height: 100.h),
                Center(
                  child: SvgPicture.asset(
                    'assets/icons/successed.svg',
                    width: 111.w,
                    height: 116.h,
                  ),
                ),
                SizedBox(height: 20.h),
                CustomText(
                  text: 'Password Reset',
                  iscenter: true,
                  color: AppColors.titleColor,
                  weight: FontWeight.w600,
                  size: 18.sp,
                ),
                SizedBox(height: 15.h),
                CustomText(
                  text: 'Your password has been successfully reset\nClick below to log in magically.',
                  iscenter: true,
                  color: AppColors.titleColor,
                  weight: FontWeight.w400,
                  size: 14.sp,
                ),
                SizedBox(height: 25.h),
                Custombutton(
                  onPressed: () {
                    context.go('/login');
                  },
                  text: 'Sign in',
                ),
                SizedBox(height: 30.h), // مساحة إضافية لتجنب overflow
              ],
            ),
          ),
        ),
      ),
    );
  }
}
