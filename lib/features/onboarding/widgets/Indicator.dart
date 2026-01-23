import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class Indicator extends StatelessWidget {
  final int currentPage;
  final int totalPages;

  const Indicator({
    super.key,
    required this.currentPage,
    required this.totalPages,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(totalPages, (index) {
        bool isActive = index == currentPage;

        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: EdgeInsets.symmetric(horizontal: 4.w),
          width: isActive ? 30.w : 10.w,
          height: 10.h,
          decoration: BoxDecoration(
            color: isActive ? Color(0xffA490AF) : const Color(0xffFAF8FB),
            borderRadius: BorderRadius.circular(12.r),
          ),
        );
      }),
    );
  }
}
