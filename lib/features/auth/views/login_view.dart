import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/auth/widgets/loginform.dart';
import 'package:rewarding_kids/features/auth/widgets/usertabs.dart';
import 'package:rewarding_kids/features/child/widgets/child_login.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 12.h),
          child: Column(
            children: [
              /// Back Button
              Row(
                children: [
                  Popbutton(
                    onPressed: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/getstarted');
                      }
                    },
                  ),
                ],
              ),

              SizedBox(height: 10.h),

              /// Title
              CustomText(
                text: 'Welcome back!',
                iscenter: true,
                size: 20.sp,
                weight: FontWeight.w600,
                color: AppColors.titleColor,
              ),

              SizedBox(height: 16.h),

              /// Tabs + Forms
              Expanded(
                child: UserTypeTabs(
                  widget1: SingleChildScrollView(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 8.h),
                      child: Column(
                        children: [
                          CustomText(
                            text: 'Sign in to Parent account',
                            iscenter: true,
                            size: 16.sp,
                            weight: FontWeight.w400,
                            color: AppColors.titleColor,
                          ),
                          SizedBox(height: 10.h),
                          Loginform(),
                          SizedBox(height: 20.h),
                        ],
                      ),
                    ),
                  ),
                  widget2: const ChildLogin(),
                  widget3: const SizedBox(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
