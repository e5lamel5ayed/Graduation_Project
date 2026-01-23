import 'package:flutter/material.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/onboarding/widgets/onboarding_slider.dart';
import 'package:rewarding_kids/features/onboarding/widgets/popbutton.dart';
import 'package:rewarding_kids/features/onboarding/widgets/skipbutton.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class OnboardingView extends StatefulWidget {
  const OnboardingView({super.key});

  @override
  State<OnboardingView> createState() => _OnboardingViewState();
}

class _OnboardingViewState extends State<OnboardingView> {
  final PageController _controller = PageController();
  int currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.Background,
      body: SafeArea(
        child: Column(
          children: [
            // ---- Top Row ----
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 12.h),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Popbutton(
                    onPressed: () {
                      if (currentPage > 0) {
                        _controller.previousPage(
                          duration: const Duration(milliseconds: 200),
                          curve: Curves.easeInOut,
                        );
                      }
                    },
                  ),
                  const Skipbutton(),
                ],
              ),
            ),

            // ---- Spacer for top gap ----
            SizedBox(height: 0.05.sh), // 5% of screen height

            // ---- Slider ----
            Expanded(
              child: OnboardingSlider(
                controller: _controller,
                onPageChanged: (index) {
                  setState(() => currentPage = index);
                },
              ),
            ),

            // ---- Bottom Spacer ----
            SizedBox(height: 0.05.sh), // 5% of screen height
          ],
        ),
      ),
    );
  }
}
