import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Nextbutton extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final VoidCallback onNext;

  const Nextbutton({
    super.key,
    required this.currentPage,
    required this.totalPages,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    double progress = (currentPage + 1) / totalPages;
    double size = 64.w; // دائرة قابلة للتغير حسب الشاشة

    return GestureDetector(
      onTap: onNext,
      child: SizedBox(
        width: size,
        height: size,
        child: Stack(
          alignment: Alignment.center,
          children: [
            Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 6.r,
                    offset: Offset(0, 3.h),
                  )
                ],
              ),
            ),
            SizedBox(
              width: size + 6.w,
              height: size + 6.h,
              child: CircularProgressIndicator(
                value: progress,
                strokeWidth: 4.w,
              //  backgroundColor: Colors.grey.shade200,
                color: Color(0xffA490AF),
              ),
            ),
            Icon(
              Icons.keyboard_arrow_right_outlined,
              color: AppColors.ActiveColor,
              size: 28.sp,
            ),
          ],
        ),
      ),
    );
  }
}
