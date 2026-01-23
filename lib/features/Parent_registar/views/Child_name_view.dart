import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/Shared/Customtextformfiled.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/optionaltextformfiled.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/progress_bar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ChildNameView extends StatefulWidget {
  const ChildNameView({super.key});

  @override
  State<ChildNameView> createState() => _ChildNameViewState();
}

class _ChildNameViewState extends State<ChildNameView> {
  final TextEditingController FnameController = TextEditingController();
  final TextEditingController NnameController = TextEditingController();
  double progress = 0.0;

  void _updateProgress() {
    if (FnameController.text.isNotEmpty || NnameController.text.isNotEmpty) {
      setState(() => progress = 0.2);
    } else {
      setState(() => progress = 0.0);
    }
  }

  @override
  void initState() {
    super.initState();
    FnameController.addListener(_updateProgress);
    NnameController.addListener(_updateProgress);
  }

  @override
  void dispose() {
    FnameController.dispose();
    NnameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final w = size.width;
    final h = size.height;

    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: h, // يضمن إن المحتوى ياخد ارتفاع الشاشة
            ),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Back button
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Popbutton(
                      onPressed: () => context.go('/login'),
                    ),
                  ),
    
                  SizedBox(height: h * 0.02),
    
                  // Progress Bar
                  AnimatedGradientProgress(progress: progress),
    
                  SizedBox(height: h * 0.03),
    
                  // Title
                  CustomText(
                    text: 'What’s Your Child’s Name?',
                    iscenter: true,
                    size: 18.sp,
                    weight: FontWeight.w500,
                    color: AppColors.titleColor,
                  ),
                  SizedBox(height: h * 0.015),
    
                  CustomText(
                    text:
                    'We will use this name throughout the app to make them feel at home',
                    iscenter: true,
                    size: 14.sp,
                    weight: FontWeight.w400,
                    color: AppColors.descColor,
                  ),
                  SizedBox(height: h * 0.03),
    
                  // Full Name field
                  Customtextformfiled(
                    hint: 'Full Name',
                    isPassword: false,
                    controller: FnameController,
                    label: 'Full Name',
                    icon: Icons.person_outline_rounded,
                  ),
                  SizedBox(height: h * 0.02),
    
                  // Nickname field
                  Optionaltextformfiled(
                      hint: 'Nick Name',
                    isPassword: false,
                    controller: NnameController,
                    label: 'Nick Name ',
                    icon: Icons.person_outline_rounded,
                  ),
                
                  SizedBox(height: h * 0.04),
    
                  // Next Button
                  Custombutton(
                    onPressed: () {
                      context.go('/child_gender');
                    },
                    text: 'Next',
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
