import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/features/onboarding/data/onboardingdata.dart';
import 'package:rewarding_kids/features/onboarding/widgets/Indicator.dart';
import 'package:rewarding_kids/features/onboarding/widgets/nextbutton.dart';
import 'package:rewarding_kids/features/onboarding/widgets/page_body.dart';

class OnboardingSlider extends StatefulWidget {
  final PageController controller;
  final ValueChanged<int> onPageChanged;

  const OnboardingSlider({
    super.key,
    required this.controller,
    required this.onPageChanged,
  });

  @override
  State<OnboardingSlider> createState() => _OnboardingSliderState();
}

class _OnboardingSliderState extends State<OnboardingSlider> {
  int currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: PageView.builder(
            allowImplicitScrolling: false,
            controller: widget.controller,
            onPageChanged: (index) {
              setState(() => currentIndex = index);
              widget.onPageChanged(index);
            },
            itemCount: onboardingData.length,
            itemBuilder: (context, index) => PageBody(
              image: onboardingData[index]['image']!,
              titletxt: onboardingData[index]['title']!,
              desctxt: onboardingData[index]['desc']!,
            ),
          ),
        ),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 5.h),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Indicator(
                currentPage: currentIndex,
                totalPages: onboardingData.length,
              ),
              Nextbutton(
                currentPage: currentIndex,
                totalPages: onboardingData.length,
                onNext: () {
                  if (currentIndex < onboardingData.length - 1) {
                    widget.controller.nextPage(
                      duration: const Duration(milliseconds: 200),
                      curve: Curves.easeInOut,
                    );
                  } else {
                    context.go('/getstarted');
                  }
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}
