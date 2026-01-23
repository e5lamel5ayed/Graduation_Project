import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/onboarding/widgets/loginbutton.dart';
import 'package:rewarding_kids/features/onboarding/widgets/page_body.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class GetstartView extends StatelessWidget {
  const GetstartView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Popbutton(onPressed: () {
                    if (context.canPop()) {
                      context.pop();
                    } else {
                      context.go('/onboarding');
                    }
                  }),
                ],
              ),

              SizedBox(height: 80.h), // بدل MediaQuery

              Expanded(
                flex: 5,
                child: PageBody(
                  titletxt: '\nWelcome to GoKid!👋',
                  desctxt: 'Create fun, meaningful tasks that help kids \nlearn, grow, and stay motivated! 💪🎁',
                  image: 'assets/onboarding/onboarding4.png',
                ),
              ),

              SizedBox(height: 25.h),

              Custombutton(
                onPressed: () {
                  context.go('/signup');
                },
                text: 'Sign Up',
              ),
              SizedBox(height: 12.h),

              Loginbutton(),
              SizedBox(height: 20.h),
            ],
          ),
        ),
      ),
    );
  }
}
