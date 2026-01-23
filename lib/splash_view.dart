import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
      context.go('/onboarding');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.Background,
      body: Center(
        child: Text(
          "GoKid!",
          style: TextStyle(
            fontSize: 40.sp,
            fontWeight: FontWeight.bold,
            color: AppColors.ActiveColor,
            letterSpacing: 2.w, // كمان خليه متناسب مع الشاشة
          ),
        ),
      ),
    );
  }
}
