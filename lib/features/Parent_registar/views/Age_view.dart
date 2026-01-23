import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/age_buttons.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/progress_bar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AgeView extends StatelessWidget {
  const AgeView({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: size.width * 0.07,
            vertical: size.height * 0.03,
          ),
          child: Column(
            children: [
              // زر العودة
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Popbutton(onPressed: () {
                    context.go('/child_gender');
                  }),
                ],
              ),

              SizedBox(height: size.height * 0.03),

              // Progress Bar
              AnimatedGradientProgress(progress: 0.6),

              SizedBox(height: size.height * 0.05),

              CustomText(
                text: 'How old is your child?',
                iscenter: true,
                size: 18.sp,
                weight: FontWeight.w500,
                color: AppColors.titleColor,
              ),

              SizedBox(height: size.height * 0.02),

              CustomText(
                text:
                'We will use the age to show activities and rewards that fit perfectly!',
                iscenter: true,
                size: 14.sp,
                weight: FontWeight.w400,
                color: AppColors.descColor,
              ),

              SizedBox(height: size.height * 0.03),

              // أزرار العمر
              AgeButtons(
                spacingWidth: size.width * 0.04,
                spacingHeight: size.height * 0.02,
              ),

              SizedBox(height: size.height * 0.05),

              Custombutton(
                onPressed: () {
                  context.go('/relation');
                },
                text: 'Continue',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
