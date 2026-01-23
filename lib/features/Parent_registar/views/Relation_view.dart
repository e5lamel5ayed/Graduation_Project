import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/Shared/Custombutton.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/progress_bar.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:rewarding_kids/features/Parent_registar/widgets/relation_dropdown.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class RelationView extends StatefulWidget {
  const RelationView({super.key});

  @override
  State<RelationView> createState() => _RelationViewState();
}

class _RelationViewState extends State<RelationView> {
  String? selectedRelation;
  double progress = 0.6;

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Popbutton(onPressed: () {
                    context.go('/age');
                  }),
                ],
              ),

              SizedBox(height: size.height * 0.02),

              AnimatedGradientProgress(progress: progress),

              SizedBox(height: size.height * 0.04),

              CustomText(
                text: 'Who are you to the child?',
                iscenter: true,
                size: 18.sp,
                weight: FontWeight.w600,
                color: AppColors.titleColor,
              ),
              SizedBox(height: size.height * 0.015),
              CustomText(
                text:
                'We will use this information to personalize the experience.',
                iscenter: true,
                size: 14.sp,
                color: AppColors.descColor,
              ),
              SizedBox(height: size.height * 0.04),

              RelationDropdown(
                selectedRelation: selectedRelation,
                onChanged: (value) {
                  setState(() {
                    selectedRelation = value;
                    progress = 0.8;
                  });
                },
              ),
              SizedBox(height: size.height * 0.02),

              Custombutton(
                text: "Continue",
                onPressed: () {
                  if (selectedRelation == null) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Please select your relation first'),
                      ),
                    );
                  } else {
                    context.go('/avatar');
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
